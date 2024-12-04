# -*- coding: utf-8 -*-
"""
Created on Mon Jun  5 23:09:27 2023

@author: PrepareUser
"""

#Transcibing audio from IP address and streaming text over ip address.

from vosk import Model, KaldiRecognizer
import socket
print("Loading model...")
# Vosk Large model
# model = Model('vosk-model-en-us-0.42-gigaspeech')
#Vosk medium model
# model = Model('vosk-model-en-us-0.22')
#Vosk small model
model = Model('vosk-model-small-en-us-0.15')
if not model:
    print("Error: Failed to load model")
else:
    print("Model loaded successfully.")
    
recognizer = KaldiRecognizer(model, 16000)



# Set up the socket to listen for incoming audio data
IP = '136.247.82.55'  # The IP address of the server
PORT = 5000  # The port to listen on
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind((IP, PORT))


# # Create another socket to broadcast the transcribed text
broadcast_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
broadcast_sock.connect(("136.247.82.55", 5001))

while True:
    data, addr = s.recvfrom(4096)   # Receive audio data from the socket
    print(data)
    if recognizer.AcceptWaveform(data):
        text = recognizer.Result()
        print(text[14:-3])
        # Broadcast the transcribed text
        broadcast_sock.sendall(text[14:-3].encode())


# Clean up
s.close()
# # Close the broadcast socket
broadcast_sock.close()