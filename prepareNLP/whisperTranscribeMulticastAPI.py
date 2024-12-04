#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun  3 18:36:38 2023

@author: prashishpaudel
"""

import socket
from flask import Flask, request
from flask_cors import CORS
import threading
import speech_recognition as sr
import whisper
import queue
import torch
import numpy as np
import audioop
import time
import collections
from speech_recognition import AudioData


app = Flask(__name__)
CORS(app)
chunk = 8192

#Whisoer Transciption Settings
# model = 'large'
model = 'tiny'
english=True
verbose=False
energy=300
pause=0.8
dynamic_energy=False

if model != "large" and english:
    model = model + ".en"
audio_model = whisper.load_model(model)


# Set up the socket for receiving audio
s = None  # Socket will be created and configured in set_socket function
t = None  # Thread will be started in set_socket function

# Create another socket to broadcast the transcribed text
broadcast_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
broadcast_sock.connect(("136.247.82.55", 5001))


def receive_and_play(audio_queue):
    while True:
        try:
            # Check if the socket has been properly configured
            if s is None:
                print("Socket not properly configured, exiting thread")
                return
    
            # Receive data from the socket
            audio_data = listen_from_ip(s)
            torch_audio = torch.from_numpy(np.frombuffer(audio_data.get_raw_data(), np.int16).flatten().astype(np.float32) / 32768.0)
            audio_data = torch_audio
            audio_queue.put_nowait(audio_data)

        except Exception as e:
            print("Error while receiving and playing audio:", e)
            return

def listen_from_ip(s, sample_rate=16000, sample_width=2, chunk_size=2048, timeout=None, duration=None, phrase_time_limit=None):

    frame_duration_ms = chunk_size // sample_rate // sample_width * 1000
    timeout_frames = None if timeout is None else max(1, int(timeout * 1000 / frame_duration_ms))
    duration_frames = None if duration is None else max(1, int(duration * 1000 / frame_duration_ms))
    phrase_time_limit_frames = None if phrase_time_limit is None else max(1, int(phrase_time_limit * 1000 / frame_duration_ms))
    pause_buffer_count = 20
    start_time = time.time()

    frames = collections.deque(maxlen=duration_frames)
    pause_buffer = collections.deque(maxlen=pause_buffer_count)
    energy_threshold = 300
    is_speech = False
    timeout_flag = False

    while True:
        audio_data, addr = s.recvfrom(chunk_size)
        frame = audioop.lin2lin(audio_data, 2, sample_width)
        frame_energy = audioop.rms(frame, sample_width)

        if timeout_frames and (time.time() - start_time) > timeout and not is_speech:
            timeout_flag = True
            break

        if frame_energy > energy_threshold:
            is_speech = True
            frames.append(frame)

            if phrase_time_limit_frames and len(frames) >= phrase_time_limit_frames:
                break
        elif is_speech:
            pause_buffer.append(frame)

            if len(pause_buffer) >= pause_buffer_count:
                break
        else:
            energy_threshold = (energy_threshold * 30 + frame_energy) / 31

    if timeout_flag:
        raise sr.WaitTimeoutError("Timeout waiting for speech")

    recorded_audio = b"".join(list(frames))
    return AudioData(recorded_audio, sample_rate, sample_width)


def transcribe_forever(audio_queue, result_queue):
    while True:
        audio_data = audio_queue.get()
        if english:
            result = audio_model.transcribe(audio_data,language='english')
        else:
            result = audio_model.transcribe(audio_data)
        if not verbose:
            predicted_text = result["text"]
            result_queue.put_nowait(predicted_text)
        else:
            result_queue.put_nowait(result)

def handle_transcriptions(result_queue):
    while True:
        transcription = result_queue.get()
        print(transcription)
        # Broadcast the transcribed text
        broadcast_sock.sendall(transcription.encode())        

@app.route('/status-check', methods=['GET'])
def status_check():
    return '', 200

@app.route('/set-multicast-group', methods=['POST'])
def set_socket():
    global s, t
    multicast_group = request.json.get('multicast_group')
    port = request.json.get('port')
    LOCAL_HOST = '0.0.0.0'
    try:
        s.close()
    finally:
        # Create and configure the socket
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.bind((LOCAL_HOST, port))
        mreq = socket.inet_aton(multicast_group) + socket.inet_aton('0.0.0.0')
        s.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)
        
        # Start the receive_and_play thread if it hasn't been started yet
        if t is None or not t.is_alive():
            audio_queue = queue.Queue()
            result_queue = queue.Queue()
            t = threading.Thread(target=receive_and_play,args=(audio_queue,))
            t.start()
            transcription_thread=threading.Thread(target=transcribe_forever,
                              args=(audio_queue, result_queue))
            transcription_thread.start()
            # Start the handle_transcriptions thread to print out transcriptions
            print_thread = threading.Thread(target=handle_transcriptions, args=(result_queue,))
            print_thread.start()
    
        return {'message': 'Socket settings updated.'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5007)
    

