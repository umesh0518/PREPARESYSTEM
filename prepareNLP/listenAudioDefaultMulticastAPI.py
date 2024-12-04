# -*- coding: utf-8 -*-
"""
Created on Tue Mar 14 23:30:50 2023

@author: Prepare User
"""

import pyaudio
import socket
from flask import Flask, request
import threading
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

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

def receive_and_play(s):
    while True:
        try:
            # check if the socket is still open
            if s.fileno() == -1:
                print("Socket closed, exiting thread")
                return

            # receive data from the socket
            data, address = s.recvfrom(chunk)

            # play the audio data
            stream.write(data)

        except Exception as e:
            print("Error while receiving and playing audio:", e)
            s.close()
            return


# Set up the socket for receiving audio
MULTICAST_GROUP = '224.0.0.1'
PORT = 5003
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind((MULTICAST_GROUP, PORT))
mreq = socket.inet_aton(MULTICAST_GROUP) + socket.inet_aton('0.0.0.0')
s.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

@app.route('/set-multicast-group', methods=['POST'])
def set_socket():
    global MULTICAST_GROUP, PORT, s, t
    MULTICAST_GROUP = request.json.get('multicast_group', MULTICAST_GROUP)
    PORT = request.json.get('port', PORT)
    LOCAL_HOST = '0.0.0.0'
    s.close()
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.bind((LOCAL_HOST, PORT))
    mreq = socket.inet_aton(MULTICAST_GROUP) + socket.inet_aton('0.0.0.0')
    s.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)
    t = threading.Thread(target=receive_and_play, args=(s,))
    t.start()
    print(MULTICAST_GROUP, type(MULTICAST_GROUP))
    print(PORT, type(PORT))
    return {'message': 'Socket settings updated.'}

if __name__ == '__main__':
    app.run(host='136.247.82.55', port=5007)

# Clean up
stream.stop_stream()
stream.close()
p.terminate()
