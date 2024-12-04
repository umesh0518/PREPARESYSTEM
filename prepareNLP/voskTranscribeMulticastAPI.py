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
from vosk import Model, KaldiRecognizer
model = Model('vosk-model-small-en-us-0.15')
# model = Model('vosk-model-en-us-0.22')
# model = Model('vosk-model-en-us-0.42-gigaspeech')
recognizer = KaldiRecognizer(model, 16000)

app = Flask(__name__)
CORS(app)


chunk = 8192


# Set up the socket for receiving audio
s = None  # Socket will be created and configured in set_socket function
t = None  # Thread will be started in set_socket function

# # Create another socket to broadcast the transcribed text
broadcast_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
broadcast_sock.connect(("136.247.82.55", 5001))

def receive_and_play():
    while True:
        try:
            # Check if the socket has been properly configured
            if s is None:
                print("Socket not properly configured, exiting thread")
                return
    
            # Receive data from the socket
            data, address = s.recvfrom(chunk)
            print(data)
            if recognizer.AcceptWaveform(data):
                text = recognizer.Result()
                print(text[14:-3])
                #Broadcast the transcribed text
                broadcast_sock.sendall(text[14:-3].encode())

        except Exception as e:
            print("Error while receiving and playing audio:", e)
            return
        

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
            t = threading.Thread(target=receive_and_play)
            t.start()
    
        return {'message': 'Socket settings updated.'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5007)
    


