# -*- coding: utf-8 -*-
"""
Created on Sat Jan 21 22:58:28 2023

@author: Prepare User
"""

# Transcribing on Audio File

# from deepspeech import Model
# import numpy as np
# import wave

# model_file_path = 'deepspeech-0.9.3-models.pbmm'
# lm_file_path = 'deepspeech-0.9.3-models.scorer'
# beam_width = 100
# lm_alpha = 0.93
# lm_beta = 1.18

# model = Model(model_file_path)
# model.enableExternalScorer(lm_file_path)

# model.setScorerAlphaBeta(lm_alpha, lm_beta)
# model.setBeamWidth(beam_width)

# stream = model.createStream()

# ### Function to read the audio file

# def read_audio_file(filename):
#     with wave.open(filename, 'rb') as w:
#         rate = w.getframerate()
#         frames = w.getnframes()
#         buffer = w.readframes(frames)

#     return buffer, rate

# ### Function to perform the transcription

# def real_time_transcription(audio_file):
#     buffer, rate = read_audio_file(audio_file)
#     offset=0
#     batch_size=8196
#     text=''

#     while offset < len(buffer):
#       end_offset=offset+batch_size
#       chunk=buffer[offset:end_offset]
#       data16 = np.frombuffer(chunk, dtype=np.int16)

#       stream.feedAudioContent(data16)
#       text=stream.intermediateDecode()
      
#       print(text)
#       offset=end_offset
#     return True


# real_time_transcription('speech.wav')





#Live Stream transcription

# import numpy as np
# from deepspeech import Model
# import socket

# # Load the deepspeech model and set parameters
# model_file_path = 'deepspeech-0.9.3-models.pbmm'
# lm_file_path = 'deepspeech-0.9.3-models.scorer'
# beam_width = 100
# lm_alpha = 0.93
# lm_beta = 1.18

# model = Model(model_file_path)
# model.enableExternalScorer(lm_file_path)
# model.setScorerAlphaBeta(lm_alpha, lm_beta)
# model.setBeamWidth(beam_width)

# stream = model.createStream()

# # Set up the socket to listen for incoming audio data
# IP = '127.0.0.1'  # The IP address of the server
# PORT = 5000  # The port to listen on
# s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# s.bind((IP, PORT))

# while True:
#     data, addr = s.recvfrom(4096)  # Receive audio data in chunks of 1024 bytes
#     data16 = np.frombuffer(data, dtype=np.int16)  # Convert the audio data to numpy array
#     stream.feedAudioContent(data16)  # Feed the audio data to the deepspeech model
#     text = stream.intermediateDecode()  # Get the intermediate transcriptions
#     print(text)  # Print the intermediate transcription on the console

# # Clean up
# stream.finishStream()
# s.close()



#Transcibing audio from Ip address and streaming text over ip address. 


import numpy as np
from deepspeech import Model
import socket

# Load the deepspeech model and set parameters
model_file_path = 'deepspeech-0.9.3-models.pbmm'
lm_file_path = 'deepspeech-0.9.3-models.scorer'
beam_width = 100
lm_alpha = 0.93
lm_beta = 1.18

model = Model(model_file_path)
model.enableExternalScorer(lm_file_path)
model.setScorerAlphaBeta(lm_alpha, lm_beta)
model.setBeamWidth(beam_width)

stream = model.createStream()

# Set up the socket to listen for incoming audio data
IP = '136.247.82.55'  # The IP address of the server
PORT = 5000  # The port to listen on
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind((IP, PORT))

# # Create another socket to broadcast the transcribed text
broadcast_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
broadcast_sock.connect(("192.168.1.95", 5001))

while True:
    data, addr = s.recvfrom(4096)  # Receive audio data in chunks of 1024 bytes
    data16 = np.frombuffer(data, dtype=np.int16)  # Convert the audio data to numpy array
    stream.feedAudioContent(data16)  # Feed the audio data to the deepspeech model
    text = stream.intermediateDecode()  # Get the intermediate transcriptions
    print(text)  # Print the intermediate transcription on the console
    
    # Broadcast the transcribed text
    broadcast_sock.sendall(text.encode())

# Clean up
stream.finishStream()
s.close()

# # Close the broadcast socket
broadcast_sock.close()
