# -*- coding: utf-8 -*-
"""
Created on Wed Apr  5 21:01:45 2023

@author: Prepare User
"""

#Transcribing the audio from mic with option to save a audio file

# import io
# from pydub import AudioSegment
# import speech_recognition as sr
# import whisper
# import queue
# import tempfile
# import os
# import threading
# import torch
# import numpy as np

# def main(model="tiny", english=False, verbose=False, energy=300, pause=0.8, dynamic_energy=False, save_file=False):
#     temp_dir = tempfile.mkdtemp() if save_file else None
#     #there are no english models for large
#     if model != "large" and english:
#         model = model + ".en"
#     audio_model = whisper.load_model(model)
#     audio_queue = queue.Queue()
#     result_queue = queue.Queue()
#     threading.Thread(target=record_audio,
#                       args=(audio_queue, energy, pause, dynamic_energy, save_file, temp_dir)).start()
#     threading.Thread(target=transcribe_forever,
#                       args=(audio_queue, result_queue, audio_model, english, verbose, save_file)).start()

#     while True:
#         print(result_queue.get())


# def record_audio(audio_queue, energy, pause, dynamic_energy, save_file, temp_dir):
#     #load the speech recognizer and set the initial energy threshold and pause threshold
#     r = sr.Recognizer()
#     r.energy_threshold = energy
#     r.pause_threshold = pause
#     r.dynamic_energy_threshold = dynamic_energy

#     with sr.Microphone(sample_rate=16000) as source:
#         print("Say something!")
#         i = 0
#         while True:
#             #get and save audio to wav file
#             audio = r.listen(source)
#             if save_file:
#                 data = io.BytesIO(audio.get_wav_data())
#                 audio_clip = AudioSegment.from_file(data)
#                 filename = os.path.join(temp_dir, f"temp{i}.wav")
#                 audio_clip.export(filename, format="wav")
#                 audio_data = filename
#             else:
#                 torch_audio = torch.from_numpy(np.frombuffer(audio.get_raw_data(), np.int16).flatten().astype(np.float32) / 32768.0)
#                 audio_data = torch_audio

#             audio_queue.put_nowait(audio_data)
#             i += 1


# def transcribe_forever(audio_queue, result_queue, audio_model, english, verbose, save_file):
#     while True:
#         audio_data = audio_queue.get()
#         if english:
#             result = audio_model.transcribe(audio_data,language='english')
#         else:
#             result = audio_model.transcribe(audio_data)

#         if not verbose:
#             predicted_text = result["text"]
#             result_queue.put_nowait("You said: " + predicted_text)
#         else:
#             result_queue.put_nowait(result)

#         if save_file:
#             os.remove(audio_data)


# main(model="tiny", english=True, verbose=False, energy=300, pause=0.8, dynamic_energy=False, save_file=False)

# if __name__ == "__main__":
#     main()


#Transcribing the audio from mic with no option to save a audio file


import speech_recognition as sr
import whisper
import queue
import tempfile
import os
import threading
import torch
import numpy as np

def main(model="tiny", english=False, verbose=False, energy=300, pause=0.8, dynamic_energy=False):
    #there are no english models for large
    if model != "large" and english:
        model = model + ".en"
    audio_model = whisper.load_model(model)
    audio_queue = queue.Queue()
    result_queue = queue.Queue()
    threading.Thread(target=record_audio,
                      args=(audio_queue, energy, pause, dynamic_energy)).start()
    threading.Thread(target=transcribe_forever,
                      args=(audio_queue, result_queue, audio_model, english, verbose)).start()

    while True:
        print(result_queue.get())
        #VVIMP: Boradcast code goes here.


def record_audio(audio_queue, energy, pause, dynamic_energy):
    #load the speech recognizer and set the initial energy threshold and pause threshold
    r = sr.Recognizer()
    r.energy_threshold = energy
    r.pause_threshold = pause
    r.dynamic_energy_threshold = dynamic_energy

    with sr.Microphone(sample_rate=16000) as source:
        print("Say something!")
        while True:
            audio = r.listen(source)
            # print('Audio captured by sr', audio.get_raw_data())
            torch_audio = torch.from_numpy(np.frombuffer(audio.get_raw_data(), np.int16).flatten().astype(np.float32) / 32768.0)
            audio_data = torch_audio
            audio_queue.put_nowait(audio_data)


def transcribe_forever(audio_queue, result_queue, audio_model, english, verbose):
    while True:
        audio_data = audio_queue.get()
        if english:
            result = audio_model.transcribe(audio_data,language='english')
        else:
            result = audio_model.transcribe(audio_data)
        if not verbose:
            predicted_text = result["text"]
            result_queue.put_nowait("You said: " + predicted_text)
        else:
            result_queue.put_nowait(result)


main(model="tiny", english=True, verbose=False, energy=300, pause=0.8, dynamic_energy=False)