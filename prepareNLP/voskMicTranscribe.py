# -*- coding: utf-8 -*-
"""
Created on Mon Mar 20 00:20:59 2023

@author: Prepare User
"""

#Transcirbing on audio from microphone

from vosk import Model, KaldiRecognizer
import pyaudio
print("Loading model...")
# Vosk Large model
# model = Model('vosk-model-en-us-0.22')
#Vosk small model
model = Model('vosk-model-small-en-us-0.15')
if not model:
    print("Error: Failed to load model")
else:
    print("Model loaded successfully.")
    


recognizer = KaldiRecognizer(model, 16000)
chunk = 8192  # Record in chunks of 1024 samples
sample_format = pyaudio.paInt16  # 16 bits per sample
channels = 1
fs = 16000  # Record at 16000 samples per second
p = pyaudio.PyAudio()
stream = p.open(format=sample_format,
                channels=channels,
                rate=fs,
                frames_per_buffer=chunk,
                input=True)
while True:
    data = stream.read(4096)
    if recognizer.AcceptWaveform(data):
        text = recognizer.Result()
        print(text[14:-3])


# Clean up
stream.stop_stream()
stream.close()

