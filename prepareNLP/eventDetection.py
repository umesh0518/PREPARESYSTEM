# -*- coding: utf-8 -*-
"""
Created on Thu Feb  2 14:46:56 2023

@author: Prepare User
"""
from datetime import datetime
import json
import socket
#Set up the socket
IP = '136.247.82.55'  # The IP address of the server(Home)
PORT = 5001  # The port to receive the text data
chunk = 108
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind((IP, PORT))

# Import Package and load Sentiment Model
import numpy as np
import tensorflow as tf
from transformers import BertTokenizer, TFBertMainLayer
sentiment_model = tf.keras.models.load_model('sentiment_model.h5',custom_objects={"TFBertMainLayer":TFBertMainLayer})
tokenizer = BertTokenizer.from_pretrained('bert-base-cased')
maxLength = 128
    

def prepare_data(input_text, tokenizer):
    token = tokenizer.encode_plus(
        input_text,
        max_length=maxLength, 
        truncation=True, 
        padding='max_length', 
        add_special_tokens=True,
        return_tensors='tf'
    )
    return {
        'input_ids': tf.cast(token.input_ids, tf.float64),
        'attention_mask': tf.cast(token.attention_mask, tf.float64)
    }

def make_prediction(model, processed_data, classes=['Negative', 'A bit negative', 'Neutral', 'A bit positive', 'Positive']):
    probs = model.predict(processed_data)[0]
    #Note change the threshold based on perfromance of model recognizing the event
    threshold = 0.55
    if np.max(probs) < threshold:
        prediction = 'Fallback Class'
    else:
        prediction = classes[np.argmax(probs)]
    return prediction

# # Create another socket to broadcast the predicted event
broadcast_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
broadcast_sock.connect(("127.0.0.1", 5002))

while True:
    data, addr = s.recvfrom(chunk)
    input_text = data.decode()
    processed_data = prepare_data(input_text, tokenizer)
    predicted_event = make_prediction(sentiment_model, processed_data=processed_data)
    print(f"Predicted Sentiment: {predicted_event}")
    result_dict = {'input_text':input_text, 'predicted_event':predicted_event, 'timestamp': str(datetime.now())}
    print(result_dict)
    # Convert the dictionary to a JSON string
    result_json = json.dumps(result_dict)
    # Broadcast the predicted event if it is one of the event and not the Fallback class
    if predicted_event!='Fallback Class':
        broadcast_sock.sendall(result_json.encode())



