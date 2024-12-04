# -*- coding: utf-8 -*-
"""
Created on Sat Jul 22 12:01:36 2023

@author: PrepareUser
"""

# -*- coding: utf-8 -*-
"""
Created on Fri Jul 21 17:12:28 2023

@author: PrepareUser
"""

import json
import subprocess
import os
import socket
from flask import Flask, request
from flask_cors import CORS
import threading
import speech_recognition as sr
import whisper
import torch
import numpy as np
import audioop
import time
import collections
from speech_recognition import AudioData


# Set path for ffmpeg
os.environ['PATH'] += ';C:/ffmpeg/bin'

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

# Create another socket to broadcast the transcribed text
broadcast_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
broadcast_sock.connect(("136.247.82.55", 5001))

# Initialize the subprocess for the ffmpeg call
process = None
t = None  # Thread will be started in set_socket function
stop_thread = False  # Add this flag at the global level

def transcribe_audio():
    global stop_thread
    while not stop_thread:
        try:
            # Check if the socket has been properly configured
            if process is None:
                print("ffmpeg process not properly configured, exiting thread")
                return
    
            # Receive data from the socket
            audio_data = listen_from_ip()
            torch_audio = torch.from_numpy(np.frombuffer(audio_data.get_raw_data(), np.int16).flatten().astype(np.float32) / 32768.0)
            audio_data = torch_audio
    
            if english:
                result = audio_model.transcribe(audio_data,language='english')
            else:
                result = audio_model.transcribe(audio_data)
            if not verbose:
                predicted_text = result["text"]
            else:
                predicted_text = result
            # Get the current timestamp in milliseconds
            current_timestamp = int(time.time() * 1000)
            # Create a dictionary with both the transcription and timestamp
            broadcast_data = {
                'transcription': predicted_text,
                'timestamp': current_timestamp
            }
            print(broadcast_data)
            # Convert the dictionary to a JSON string and broadcast it
            broadcast_sock.sendall(json.dumps(broadcast_data).encode())
            
        except Exception as e:
            print("Error while receiving and playing audio:", e)
            return

def listen_from_ip(sample_rate=16000, sample_width=2, chunk_size=2048, timeout=None, duration=None, phrase_time_limit=None):

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
        audio_data= process.stdout.read(chunk_size)
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

@app.route('/status-check', methods=['GET'])
def status_check():
    return '', 200

@app.route('/set-multicast-group', methods=['POST'])
def set_socket():
    global process, t, stop_thread  # Include the stop_thread global variable
    multicast_group = request.json.get('multicast_group')
    port = request.json.get('port')
    scenario_id = request.json.get('scenario_id')
    
    # If there's an existing process, close it. Fast Operation
    if process:
        process.kill()

    # If there's an existing thread and it's running
    if t and t.is_alive():
        # Signal the thread to stop by setting the flag
        stop_thread = True
        
        # Optionally, wait for the thread to finish its execution
        t.join()
        
        # Once the thread has stopped, reset the flag for future use
        stop_thread = False

    
    try:
        # # If there's an existing socket, Fast it. Slow Operation
        if process:
            process.kill()
        streamURL = f'udp://{multicast_group}:{port}'  # udp protocol
        # streamURL = "http://listen.noagendastream.com/noagenda"
        process = subprocess.Popen(['ffmpeg', '-loglevel', 'quiet', '-i',
                                streamURL,
                                '-ar', '16000' , '-ac', '1', '-f', 's16le', '-'],
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Start a new thread for transcribe_audio
        t = threading.Thread(target=transcribe_audio)
        t.start()
        return {'message': 'Socket settings updated.'}

    except Exception as e:
        # Handle any exception that might occur and send an appropriate response
        print(f"Error setting socket: {e}")
        return {'message': 'Error setting socket. Please check server logs for details.'}, 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5007)


































