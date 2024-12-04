# -*- coding: utf-8 -*-
"""
Created on Mon Jul  3 15:42:51 2023

@author: spappad
"""

# -*- coding: utf-8 -*-
"""
Created on Sat Jul  1 12:45:04 2023

@author: PrepareUser


"""



from vosk import Model, KaldiRecognizer, SetLogLevel
import subprocess
import os

#Set path for ffmpeg
os.environ['PATH'] += ';C:/ffmpeg/bin'
# initialize variables
SetLogLevel(0)
sample_rate=16000
model = Model('vosk-model-small-en-us-0.15')

ip = '239.192.210.8'
port = '4450'

# streamURL = "http://listen.noagendastream.com/noagenda"

streamURL = f'udp://{ip}:{port}'  # udp protocol


# create recognizer
recognizer = KaldiRecognizer(model, sample_rate)

# create ffmpeg process to read the stream
process = subprocess.Popen(['ffmpeg', '-loglevel', 'quiet', '-i',
                            streamURL,
                            '-ar', str(sample_rate) , '-ac', '1', '-f', 's16le', '-'],
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE)

while True:
    data = process.stdout.read(2048)
    # print(len(data))
    if len(data) == 0:
        print("end of stream")
        break
    if recognizer.AcceptWaveform(data):
        print(recognizer.Result())
    # else:
    #     print(recognizer.PartialResult())

print(recognizer.FinalResult())
print("End Stream Transcription")









