
#Transcibing audio from IP address and streaming text over ip address.

from vosk import Model, KaldiRecognizer
import pyaudio
import socket

print("Loading model...")
# Vosk Large model
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


chunk = 8192  # Record in chunks of 1024 samples
duration = 5  # Record for 5 seconds
fs = 16000
# # Create another socket to broadcast the transcribed text
broadcast_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
broadcast_sock.connect(("136.247.82.55", 5001))

while True:
    # Create a buffer to hold the recorded audio data
    frames = []
    num_frames = int(fs / chunk * duration)
    
    # Record the audio data in chunks
    for i in range(num_frames):
        data, addr = s.recvfrom(4096)   # Receive audio data from the socket
        frames.append(data)
    # Transcribe the recorded audio
    audio_data = b"".join(frames)
    if recognizer.AcceptWaveform(audio_data):
        text = recognizer.Result()
        print(text[14:-3])
        # Broadcast the transcribed text
        broadcast_sock.sendall(text[14:-3].encode())

# Clean up
s.close()
# # Close the broadcast socket
broadcast_sock.close()