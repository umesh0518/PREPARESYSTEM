# -*- coding: utf-8 -*-
"""
Created on Wed Jan 18 21:22:17 2023

@author: Prepare User


"""

import socket

# Set up the socket
IP = '136.247.82.55'  # The IP address of the server
PORT = 5001  # The port to receive the text data
chunk = 2048
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind((IP, PORT))

while True:
    data, addr = s.recvfrom(chunk)
    print(data.decode(),"new chunk----")


