from datetime import datetime
import json
import string
import socket
from flask import Flask, request
# Import Package and load Event Model
import numpy as np
import threading
import tensorflow as tf
from transformers import BertTokenizer, TFBertMainLayer

app = Flask(__name__)

#Set up the socket
IP = '136.247.82.55'  # The IP address of the server(Home)
PORT = 5001  # The port to receive the text data
chunk = 1004
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind((IP, PORT))

# Import Package and load Event Model
event_model = tf.keras.models.load_model('sentiment_model.h5',custom_objects={"TFBertMainLayer":TFBertMainLayer})
tokenizer = BertTokenizer.from_pretrained('bert-base-cased')
maxLength = 128

t = None  # Thread will be started in predict_event function

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

def process_prediction (lookup_dict):
    events = set(lookup_dict.values())
    # Create another socket to broadcast the predicted event
    broadcast_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    broadcast_sock.connect(("127.0.0.1", 5002))
    while True:
        data, addr = s.recvfrom(chunk)
        input_text = data.decode()
        
        if len(input_text) !=0:
        
            # Reset counter for each event class
            counter = {event: 0 for event in events}
    
        
            # Count occurrence of each event class
            for text in input_text.split():
                event = lookup_dict.get(text.strip(' '+ string.punctuation))
                if event != None:
                   counter[event]+=1
                   
            print('Length of input text',len(input_text))
    
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
    
    
@app.route('/detect-event', methods=['POST'])
def predict_event():
    global t
    lookup_dict = request.json.get('lookup_dict')
    # Start the process_prediction thread if it hasn't been started yet
    if t is None or not t.is_alive():
        t = threading.Thread(target=process_prediction, args = (lookup_dict,))
        t.start()
    return {'message': 'Lookup words received.'}
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
