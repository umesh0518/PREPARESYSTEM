# -*- coding: utf-8 -*-
"""
Created on Sun Feb 26 17:57:27 2023

@author: Prepare User
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

# Set up the multicast group and port
# MULTICAST_GROUP = '239.192.24.256'
MULTICAST_GROUP = '224.0.0.1'
MULTICAST_PORT = 5000

# Set up the socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
s.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 2)

# Record audio and send it over the network
while True:
    data = stream.read(chunk)
    s.sendto(data, (MULTICAST_GROUP, MULTICAST_PORT))

# Clean up
stream.stop_stream()
stream.close()
p.terminate()




