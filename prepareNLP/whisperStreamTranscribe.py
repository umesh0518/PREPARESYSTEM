# -*- coding: utf-8 -*-
"""
Created on Thu Apr  6 16:23:55 2023

@author: Prepare User
"""
#Transcribing the audio from audio stream coming from IP address.
import speech_recognition as sr
import whisper
import queue
import threading
import torch
import numpy as np
import socket
import audioop
import time
import collections
from speech_recognition import AudioData


def main(model="large", english=False, verbose=False, energy=300, pause=0.8, dynamic_energy=False):
    #there are no english models for large
    if model != "large" and english:
        model = model + ".en"
    audio_model = whisper.load_model(model)
    audio_queue = queue.Queue()
    result_queue = queue.Queue()
    threading.Thread(target=record_audio,
                      args=(audio_queue, energy, pause, dynamic_energy)).start()
    threading.Thread(target=transcribe_forever,
                      args=(audio_queue, result_queue, audio_model, english, verbose)).start()
    # # Create another socket to broadcast the transcribed text
    broadcast_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    broadcast_sock.connect(("136.247.82.55", 5001))
    while True:
        transcription = result_queue.get()
        print(transcription)
        # Broadcast the transcribed text
        broadcast_sock.sendall(transcription.encode())
        
def listen_from_ip(ip_address, port, sample_rate=16000, sample_width=2, chunk_size=2048, timeout=None, duration=None, phrase_time_limit=None):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind((ip_address, port))

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
        audio_data, addr = sock.recvfrom(chunk_size)
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

    sock.close()

    if timeout_flag:
        raise sr.WaitTimeoutError("Timeout waiting for speech")

    recorded_audio = b"".join(list(frames))
    return AudioData(recorded_audio, sample_rate, sample_width)


def record_audio(audio_queue, energy, pause, dynamic_energy):
    #load the speech recognizer and set the initial energy threshold and pause threshold
    r = sr.Recognizer()
    r.energy_threshold = energy
    r.pause_threshold = pause
    r.dynamic_energy_threshold = dynamic_energy
    while True:
        audio_data = listen_from_ip('136.247.82.55', 5000)
        torch_audio = torch.from_numpy(np.frombuffer(audio_data.get_raw_data(), np.int16).flatten().astype(np.float32) / 32768.0)
        audio_data = torch_audio
        audio_queue.put_nowait(audio_data)


def transcribe_forever(audio_queue, result_queue, audio_model, english, verbose):
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


main(model="tiny", english=True, verbose=False, energy=300, pause=0.8, dynamic_energy=False)



