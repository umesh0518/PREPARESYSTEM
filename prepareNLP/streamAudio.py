# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""
import pyaudio
import socket

# Set up the audio stream
chunk = 1024  # Record in chunks of 1024 samples
sample_format = pyaudio.paInt16  # 16 bits per sample
channels = 1
fs = 16000  # Record at 16000 samples per second

p = pyaudio.PyAudio()
stream = p.open(format=sample_format,
                channels=channels,
                rate=fs,
                frames_per_buffer=chunk,
                input=True)

# Set up the socket
IP = '136.247.82.55'
PORT = 5000  # The port to send the data to
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Record audio and send it over the network
while True:
    data = stream.read(chunk)
    s.sendto(data, (IP, PORT))

# Clean up
stream.stop_stream()
stream.close()
p.terminate()

#Note : You may also need to check if the server is running and accepting connections 
# on the specified IP and port before starting the loop.