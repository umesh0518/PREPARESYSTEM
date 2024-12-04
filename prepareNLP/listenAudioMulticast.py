# -*- coding: utf-8 -*-
"""
Created on Sun Feb 26 21:31:18 2023

@author: Prepare User
"""

import pyaudio
import socket

# Set up PyAudio

sample_format = pyaudio.paInt16  # 16 bits per sample
channels = 1
fs = 16000  # Play at 44100 samples per second
chunk = 8192
p = pyaudio.PyAudio()
stream = p.open(format=sample_format,
                channels=channels,
                rate=fs,
                output=True)

# Set up the socket for receiving audio
MULTICAST_GROUP = '239.192.128.154'
LOCAL_HOST = '0.0.0.0'
PORT = 	4900
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# Note: LOCAL_HOST specifies the network interface that the program wants to receive data on.
s.bind((LOCAL_HOST, PORT))

#Note : MULTICAST_GROUP specify the address that the program wants to recieve data from.
#Note: 0.0.0.0 address is used to specify the network interface that the program wants to receive data on.
mreq = socket.inet_aton(MULTICAST_GROUP) + socket.inet_aton('0.0.0.0')
s.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

# Receive audio data and play it
while True:
    data, address = s.recvfrom(chunk)
    print(data)
    stream.write(data)

# Clean up
stream.stop_stream()
stream.close()
p.terminate()
