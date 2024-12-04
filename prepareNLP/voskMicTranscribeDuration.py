
#Transcirbing on audio from microphone

from vosk import Model, KaldiRecognizer
import pyaudio

print("Loading model...")
model = Model('vosk-model-small-en-us-0.15')
if not model:
    print("Error: Failed to load model")
else:
    print("Model loaded successfully.")

recognizer = KaldiRecognizer(model, 16000)

chunk = 8192  # Record in chunks of 8192 samples
sample_format = pyaudio.paInt16  # 16 bits per sample
channels = 1
fs = 16000  # Record at 16000 samples per second
duration = 5  # Record for 5 seconds

p = pyaudio.PyAudio()
stream = p.open(format=sample_format,
                channels=channels,
                rate=fs,
                frames_per_buffer=chunk,
                input=True)

while True:
    # Create a buffer to hold the recorded audio data
    frames = []
    num_frames = int(fs / chunk * duration)
    
    # Record the audio data in chunks
    for i in range(num_frames):
        data = stream.read(chunk)
        frames.append(data)
    
    # Transcribe the recorded audio
    audio_data = b"".join(frames)
    if recognizer.AcceptWaveform(audio_data):
        text = recognizer.Result()
        print(text[14:-3])

# Clean up
stream.stop_stream()
stream.close()
p.terminate()


