 
#Note: At first check if Ip adress is reechable, do I need to do any authentication

import pyaudio
import socket

# Set up the audio stream
sample_format = pyaudio.paInt16  # 16 bits per sample
channels = 1
fs = 16000  # Play at 44100 samples per second
chunk = 2048

p = pyaudio.PyAudio()
stream = p.open(format=sample_format,
                channels=channels,
                rate=fs,
                frames_per_buffer=chunk,
                output=True)

# Set up the socket
IP = '136.247.82.55'  # The IP address(Home - Windows)
PORT = 5000  # The port to receive the data from
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind((IP, PORT))

# Receive audio data and play it
while True:
    data, addr = s.recvfrom(chunk)
    stream.write(data)
    print(len(data))

# Clean up
stream.stop_stream()
stream.close()
p.terminate()

#Note same code, but it wait untill the full chunk of 8192 is receieved before writing it.

# import pyaudio
# import socket
# # Set up the audio stream
# sample_format = pyaudio.paInt16  # 16 bits per sample
# channels = 1
# fs = 16000  # Play at 44100 samples per second
# chunk = 12288 #You can't allocate more buffer size than this. This is not permitted by the system.

# p = pyaudio.PyAudio()
# stream = p.open(format=sample_format,
#                 channels=channels,
#                 rate=fs,
#                 frames_per_buffer=chunk,
#                 output=True)

# # Set up the socket
# IP = '136.247.82.55'  # The IP address(Home - Windows)
# # IP = '0.0.0.0'
# PORT = 5000  # The port to receive the data from
# s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# s.bind((IP, PORT))

# # Receive audio data and play it
# while True:
#     data = b''  # initialize empty bytes object to store received data
#     while len(data) < chunk:
#         packet, addr = s.recvfrom(chunk - len(data))
#         data += packet
#     stream.write(data)

# # Clean up
# stream.stop_stream()
# stream.close()
# p.terminate()
