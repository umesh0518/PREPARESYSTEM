# -*- coding: utf-8 -*-
"""
Created on Wed Mar 15 11:49:52 2023

@author: Prepare User
"""

from datetime import datetime
import json
import string
import socket
#Set up the socket
IP = '136.247.82.55'  # The IP address of the server(Home)
PORT = 5001  # The port to receive the text data
chunk = 1004
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind((IP, PORT))

# Import Package and load Event Model
import numpy as np
import tensorflow as tf
from transformers import BertTokenizer, TFBertMainLayer
event_model = tf.keras.models.load_model('sentiment_model.h5',custom_objects={"TFBertMainLayer":TFBertMainLayer})
tokenizer = BertTokenizer.from_pretrained('bert-base-cased')
maxLength = 128




# Lookup dictionary of words for each Event class

lookup_dict = {
        "abominable": "Negative",
        "assure": "A bit positive",
        "atrocious": "Negative",
        "average": "Neutral",
        "awful": "Negative",
        "bad": "Negative",
        "badness": "Negative",
        "dire": "Negative",
        "direful": "Negative",
        "disappoint": "A bit negative",
        "dread": "Negative",
        "dreaded": "Negative",
        "dreadful": "Negative",
        "excellent": "Positive",
        "fantabulous": "Positive",
        "fearful": "Negative",
        "fearsome": "Negative",
        "first-class": "Positive",
        "frightening": "Negative",
        "good": "A bit positive",
        "helpless": "A bit negative",
        "horrendous": "Negative",
        "horrific": "Negative",
        "incapacitated": "A bit negative",
        "let_down": "A bit negative",
        "nice": "A bit positive",
        "norm": "Neutral",
        "o.k.": "Neutral",
        "ok": "Neutral",
        "okay": "Neutral",
        "okeh": "Neutral",
        "okey": "Neutral",
        "outstanding": "Positive",
        "painful": "Negative",
        "promise": "A bit positive",
        "spectacular": "Positive",
        "splendid": "Positive",
        "terrible": "Negative",
        "unspeakable": "Negative"
    }
events =  (set(lookup_dict.values()))



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
    
    # Reset counter for each event class
    counter = {event: 0 for event in events}


    # Count occurrence of each event class
    for text in input_text.split():
        event = lookup_dict.get(text.strip(' '+ string.punctuation))
        if event != None:
           counter[event]+=1

    # Determine the event class with the highest counter value
    lookUp_predicted_event = max(counter,key=counter.get)
    lookUp_predicted_event =  lookUp_predicted_event if counter[ lookUp_predicted_event] !=0 else 'Fallback Class'
    
    # Make event prediction using the NLP model
    processed_data = prepare_data(input_text, tokenizer)
    nlp_predicted_event = make_prediction(event_model, processed_data=processed_data)
    
    #Different case for evaluating final predicted event
    
       #Case 1: If both nlp and lookup prediction = 'Fallback Class'
    if nlp_predicted_event == 'Fallback Class' and lookUp_predicted_event == 'Fallback Class':
        final_predicted_event = nlp_predicted_event
        #Case 2:  If nlp prediction = 'Fallback Class' but lookup prediction ! = 'Fallback Class':
    elif nlp_predicted_event == 'Fallback Class' and lookUp_predicted_event != 'Fallback Class':
        final_predicted_event = lookUp_predicted_event
        #Case 3:  If nlp prediction != 'Fallback Class' but lookup prediction == 'Fallback Class':
    elif nlp_predicted_event != 'Fallback Class' and lookUp_predicted_event == 'Fallback Class':
        final_predicted_event = nlp_predicted_event
        
        #Case 4: If nlp_prediction and lookup prediction doesn't match. And lookup predicted event counter is more than half of sum of total counter values
    elif nlp_predicted_event != lookUp_predicted_event:
         if counter[lookUp_predicted_event]/sum(counter.values()) >= 0.5:
             final_predicted_event = lookUp_predicted_event
        #Case 5 : For all remaining case
    else:
        final_predicted_event = nlp_predicted_event
    
    
    
    # Print the predicted event using both methods
    print('\n','-----------------Prediction start-------------', '\n')
    print(f"Predicted Event (Lookup): { lookUp_predicted_event}")
    print(counter)
    print(f"Predicted Event (NLP): {nlp_predicted_event}")
    # Construct the result dictionary
    result_dict = {
        'input_text': input_text,
        'predicted_event_lookup':  lookUp_predicted_event,
        'predicted_event_nlp': nlp_predicted_event,
        'final_predicted_event' : final_predicted_event,
        'timestamp': str(datetime.now())
    }
    print(result_dict)
    print('\n','-----------------Prediction end-------------')
    
    # Convert the dictionary to a JSON string
    result_json = json.dumps(result_dict)
    
    
    
    # Broadcast the predicted event if it is one of the event and not the Fallback class
    if final_predicted_event!='Fallback Class':
        broadcast_sock.sendall(result_json.encode())