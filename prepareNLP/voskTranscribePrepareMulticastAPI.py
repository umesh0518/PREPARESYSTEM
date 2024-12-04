#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun  3 18:36:38 2023

@author: prashishpaudel
"""
import json
import time
import socket
import os
import subprocess
from flask import Flask, request
from flask_cors import CORS
import threading
from vosk import Model, KaldiRecognizer,SetLogLevel
model = Model('vosk-model-small-en-us-0.15')
# model = Model('vosk-model-en-us-0.22')
# model = Model('vosk-model-en-us-0.42-gigaspeech')
recognizer = KaldiRecognizer(model, 16000)
# initialize variables
SetLogLevel(0)

#Set path for ffmpeg
os.environ['PATH'] += ';C:/ffmpeg/bin'

app = Flask(__name__)
CORS(app)


chunk = 2048
sample_rate = 16000


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
            data = s.stdout.read(chunk)
            if recognizer.AcceptWaveform(data):
                text = recognizer.Result()
                # Get the current timestamp in milliseconds
                current_timestamp = int(time.time() * 1000)
                
                # Create a dictionary with both the transcription and timestamp
                broadcast_data = {
                    'transcription': text[14:-3],
                    'timestamp': current_timestamp
                }
                print(broadcast_data)
                # Convert the dictionary to a JSON string and broadcast it
                broadcast_sock.sendall(json.dumps(broadcast_data).encode()) 

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
    scenario_id = request.json.get('scenario_id')
    try:
        s.kill()
    finally:
        # Create and configure the socket
        streamURL = f'udp://{multicast_group}:{port}'
        s = subprocess.Popen(['ffmpeg', '-loglevel', 'quiet', '-i',
                    streamURL,
                    '-ar', str(sample_rate) , '-ac', '1', '-f', 's16le', '-'],
                    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Start the receive_and_play thread if it hasn't been started yet
        if t is None or not t.is_alive():
            t = threading.Thread(target=receive_and_play)
            t.start()
    
        return {'message': 'Socket settings updated.'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5007)
    


