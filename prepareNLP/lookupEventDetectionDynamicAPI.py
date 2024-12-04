# -*- coding: utf-8 -*-
"""
Created on Wed Apr  5 10:02:42 2023

@author: Prepare User
"""
import nltk
import os
import time
import math
import json
import string
import socket
import requests
from flask import Flask, request
import numpy as np
import threading
import tensorflow as tf
from transformers import AutoTokenizer
from flask_cors import CORS

# nltk.download('stopwords')
from nltk.corpus import stopwords
stop_words = set(stopwords.words('english'))

# Global variable for start timestamp
startTimestamp = 0
endTimestamp = math.inf

app = Flask(__name__)
CORS(app)

#Set up the socket
IP = '136.247.82.55'  # The IP address of the server(Home)
PORT = 5001  # The port to receive the text data
chunk = 1004
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind((IP, PORT))

t = None  # Thread will be started in predict_event function
scenario_duration = None
nodes = [] # arrays of values to be saved to database
final_predicted_event_set = set() #To keep track of unique predicted NLP events
transcribed_text = [] #To save all transcribed texts

def get_latest_model_path(scenario_id, model_name):
    """
    Fetch the latest version of a model from the "Model/scenario_id" directory.
    
    :param scenario_id: ID of the scenario.
    :param model_name: Base name of the model.
    :return: Path to the latest version of the model.
    """
    
    # Build the model directory path
    model_dir = os.path.join("Models", str(scenario_id))
    
    # Ensure directory exists
    if not os.path.exists(model_dir):
        raise ValueError(f"Model directory {model_dir} does not exist!")
    
    # List all models matching the pattern
    models = [f for f in os.listdir(model_dir) if f.startswith(model_name + "_v")]
    
    # If no models found, raise an error
    if not models:
        raise ValueError(f"No models found with the pattern {model_name}_v* in {model_dir}!")
    
    # Sort models based on version number
    models_sorted = sorted(models, key=lambda x: int(x.split("_v")[-1]))
    
    # Pick the latest version
    latest_model_name = models_sorted[-1]
    return os.path.join(model_dir, latest_model_name)
 
def prepare_data(input_text, tokenizer,maxLength):
    token = tokenizer.encode_plus(
        input_text,
        max_length=maxLength, 
        truncation=True, 
        padding='max_length', 
        add_special_tokens=True,
        return_tensors='tf'
    )
    return {
        'input_ids': tf.cast(token.input_ids, tf.int32),
        'attention_mask': tf.cast(token.attention_mask, tf.int32)
    }

def make_prediction(model, processed_data, event_types):
    probs = model({
'input_ids': processed_data['input_ids'],
'attention_mask': processed_data['attention_mask']})
    #Note change the threshold based on perfromance of model recognizing the event
    threshold = 0.55
    if np.max(probs) < threshold:
        prediction = 'Fallback Class'
    else:
        prediction = event_types[np.argmax(probs)]
    return prediction

def process_prediction (lookup_dict,event_id,event_time,event_timeout,event_penalty_coefficient,scenario_name,scenario_id,model_name,scenario_role_id):
    global final_predicted_event_set
    
    # Fetch the path of the latest model
    model_path = get_latest_model_path(scenario_id, model_name)
    print('This is the model Path',model_path)
    # Load Event Model
    event_model = tf.saved_model.load(model_path)
    
    event_types_encoded = event_model.custom_att.numpy()
    event_types = [event.decode('utf-8') for event in event_types_encoded]
    tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
    maxLength = 128
    events = set(lookup_dict.values())
    # Create another socket to broadcast the predicted event
    broadcast_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    broadcast_sock.connect(("136.247.82.55", 5002))
    
    # Pre-process lookup_dict to remove punctuation and convert to lowercase
    translator = str.maketrans('', '', string.punctuation)
    porcessed_lookup_dict = {key.lower().translate(translator): value for key, value in lookup_dict.items()}
    lookup_dict = {}
    # Add each words from lookup_dict keys as a key 
    for key, value in porcessed_lookup_dict.items():
        # Add the entire original key to the mapping
        if key not in lookup_dict:
            lookup_dict[key] = [value]
        
        for word in key.split():
            if word not in stop_words:  # Check if the word is not a stopword
                if word not in lookup_dict:
                    lookup_dict[word] = [value]
                else:
                    # Avoid adding duplicates
                    if value not in lookup_dict[word]:
                        lookup_dict[word].append(value)
    print(lookup_dict)
    
    while True: 
        data, addr = s.recvfrom(chunk)
        decoded_data = data.decode()
        incoming_data = json.loads(decoded_data)
        
        print('This is incoming data',incoming_data)
        
        input_text = incoming_data['transcription']
        timestamp = int(incoming_data['timestamp'])
        
        if timestamp > endTimestamp:
            break  # This will exit the while loop
        
        if timestamp < startTimestamp:
            continue
        
        # If the input text is "you" (case insensitive), then ignore this iteration and move to the next one
        if input_text.lower().strip() == "you":
            continue
        if len(input_text) !=0:
            
            #Adding a input text to transcribed_text
            transcribed_text.append(f'{input_text}:{timestamp}')
            
            # Reset counter for each event class
            counter = {event: 0 for event in events}
            # Get a list of words from the input text
            words = input_text.lower().split()
            # Create a list to store the individual words, bigrams, and trigrams
            ngrams = []
            # Add individual words to ngrams
            ngrams.extend(words)
            # Add bigrams to ngrams
            for i in range(len(words) - 1):
                ngrams.append(' '.join(words[i:i+2]))
            # Add trigrams to ngrams
            for i in range(len(words) - 2):
                ngrams.append(' '.join(words[i:i+3]))
            # Now, loop through ngrams to look for ngrams in lookup_dict
            for text in ngrams:
                events_list = lookup_dict.get(text.strip(string.punctuation), [])
                for event in events_list:
                    counter[event] += 1
                   
            print('Length of input text',len(input_text))
    
            # Determine the event class with the highest counter value
            lookUp_predicted_event = max(counter,key=counter.get)
            lookUp_predicted_event =  lookUp_predicted_event if counter[ lookUp_predicted_event] !=0 else 'Fallback Class'
            
            # Make event prediction using the NLP model
            processed_data = prepare_data(input_text, tokenizer,maxLength)
            nlp_predicted_event = make_prediction(event_model, processed_data=processed_data,event_types=event_types)
            
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
                'play_id': None,
                'scenario_role_id': scenario_role_id,
                'predicted_text': input_text,
                'predicted_event_lookup':  lookUp_predicted_event,
                'lookup_counter': counter,
                'predicted_event_nlp': nlp_predicted_event,
                'final_predicted_event' : final_predicted_event,
                'predicted_event_id': None,
                'time': None,
                'timeout':None,
                'penalty_coefficient':None,
                'timestamp': str(int(time.time() * 1000))
            }
            print(result_dict)
            print('\n','-----------------Prediction end-------------')
            
            # Convert the dictionary to a JSON string
            result_json = json.dumps(result_dict)            
                
            #Broadcast the predicted event if it is one of the event and not the Fallback class
            if final_predicted_event != 'Fallback Class':
                result_dict['predicted_event_id'] = event_id[final_predicted_event]
                result_dict['time'] = event_time[final_predicted_event]
                result_dict['timeout'] = event_timeout[final_predicted_event]
                result_dict['penalty_coefficient'] = event_penalty_coefficient[final_predicted_event]
                broadcast_sock.sendall(result_json.encode())
    
                # Append result_dict to nodes if final_predicted_event is unique
                if final_predicted_event not in final_predicted_event_set:
                    final_predicted_event_set.add(final_predicted_event)
                    nodes.append(result_dict)
                    

@app.route('/status-check', methods=['GET'])
def status_check():
    return '', 200
   
@app.route('/detect-event', methods=['POST'])
def predict_event():
    global t
    global startTimestamp
    global endTimestamp
    global nodes
    global scenario_duration
    # Reset nodes before start of processing
    nodes = []
    lookup_dict = request.json.get('lookup_dict')
    model_name = request.json.get('model_name')
    scenario_id = request.json.get('scenario_id') #not needed in database
    scenario_name = request.json.get('scenario_name')#not needed in database
    scenario_duration = request.json.get('scenario_duration')#not needed in database
    scenario_role_id = request.json.get('scenario_role_id')
    event_id = request.json.get('event_id')
    event_time = request.json.get('event_time')
    event_timeout = request.json.get('event_timeout')
    event_penalty_coefficient = request.json.get('event_penalty_coefficient')

    
    startTimestamp = int(time.time() * 1000) #Define startTimestamp
    endTimestamp = math.inf
    # Start the process_prediction thread if it hasn't been started yet
    if t is None or not t.is_alive():
        t = threading.Thread(target=process_prediction, args = (lookup_dict,event_id,event_time,event_timeout,event_penalty_coefficient,scenario_name,scenario_id,model_name,scenario_role_id))
        t.start()
    return {'message': 'Lookup words received.'}

@app.route('/stop-processing', methods=['POST'])
def stop_processing():
    global nodes
    global transcribed_text
    global scenario_duration
    global endTimestamp
    
    # Extract play_id from the request query parameters
    play_id = request.json.get('play_id')
    start_time = request.json.get('start_time')
    scenario_id = request.json.get('scenario_id')

    # Update play_id in each node and calculate the scores
    for node in nodes:
        # Definition of each term
        # A = Absolute event time (cutoff time).
        # T = Actual event time.
        # D = Total duration of the scenario.
        # TO = Timeout duration.
        # PC = Penalty coefficient in percentage (%).
        
        node['play_id'] = play_id
        D = scenario_duration * 1000
        A = int(node['time']) * 1000
        T = int(node['timestamp']) - start_time
        TO = int(node['timeout']) * 1000 if node['timeout'] else 0
        PC = int(node['penalty_coefficient']) / 100 if node['penalty_coefficient'] else 1
        
        if TO <= 0 or PC <= 0:
            score = None
        elif T > D:
            score = 0
        elif T <= A + TO:
            score = 100
        else:
            OT = T - (A + TO)
            P = (D - OT) / (D - (A + TO))
            Penalized_P = math.pow(P, PC)
            score = min(Penalized_P * 100, 100)
        
        node['automatedNLPScore'] = math.ceil(score) if score is not None else None
        
    endTimestamp = int(time.time() * 1000)
    print('nodes:',nodes)
    
    # Write all input_texts to a file
    # Define the main directory name
    main_directory = 'Transcribed text'
    
    # Check if the main directory exists, if not, create it
    if not os.path.exists(main_directory):
        os.makedirs(main_directory)
    
    # Define the subdirectory name using scenario_id
    sub_directory = os.path.join(main_directory, str(scenario_id))
    
    # Check if the subdirectory exists, if not, create it
    if not os.path.exists(sub_directory):
        os.makedirs(sub_directory)
    
    # Write all input_texts to a file
    file_path = os.path.join(sub_directory, f'{scenario_id}_scenarioId__{play_id}_playID.txt')
    with open(file_path, 'w',encoding = 'utf-8') as f:
        for text in transcribed_text:
            f.write(f'{text}\n')


    # Make a request to /saveNlpPlay API      
    response = requests.post('http://136.247.82.55:1339/saveNlpPlay', json={"data": nodes})
    print('This is the response from sevrer',response) #response from the server

    # Reset nodes for the next batch of processing
    nodes = []
    final_predicted_event_set = set()
    transcribed_text.clear()
    return {'message': 'Processing will be stopped.'}
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
