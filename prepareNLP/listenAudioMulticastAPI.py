# -*- coding: utf-8 -*-
"""
Created on Tue Mar 14 23:30:50 2023

@author: Prepare User
"""

import pyaudio
import socket
from flask import Flask, request
import threading

app = Flask(__name__)

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
s = None  # Socket will be created and configured in set_socket function
t = None  # Thread will be started in set_socket function

def receive_and_play():
    while True:
        try:
            # Check if the socket has been properly configured
            if s is None:
                print("Socket not properly configured, exiting thread")
                return
    
            # Receive data from the socket
            data, address = s.recvfrom(chunk)

            # Play the audio data
            stream.write(data)

        except Exception as e:
            print("Error while receiving and playing audio:", e)
            return
        
# Set up a list to track active threads


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
    

# Clean up
stream.stop_stream()
stream.close()
p.terminate()
