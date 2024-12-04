# -*- coding: utf-8 -*-
"""
Created on Tue Apr  4 21:03:47 2023

@author: Prepare User
"""

# -*- coding: utf-8 -*-
"""
Created on Mon Apr  3 10:42:54 2023

@author: Prepare User
"""
import os
import threading
import json
import pandas as pd
import numpy as np
from tqdm.auto import tqdm
import tensorflow as tf
from transformers import AutoTokenizer, TFAutoModel
from flask import Flask,request
from flask_cors import CORS
import requests


app = Flask(__name__)
CORS(app)

t = None  # Thread will be started in start_training function

def get_next_model_name(directory, base_model_name, scenario_id):
    """
    Generates the next model name based on the existing models in the directory
    considering the scenario_id.

    If no existing model is found, returns base_model_name_1.
    If models with versions exist, returns base_model_name_nextVersion.
    """
    # Check if the main directory exists.
    if not os.path.exists(directory):
        return base_model_name + "_v1"

    scenario_path = os.path.join(directory, str(scenario_id))
    
    # Check if the scenario directory exists. If not, return the base_model_name with version 1.
    if not os.path.exists(scenario_path):
        return base_model_name + "_v1"

    # List all model directories inside the scenario directory that start with base_model_name
    existing_models = [f for f in os.listdir(scenario_path) 
                       if os.path.isdir(os.path.join(scenario_path, f)) 
                       and f.startswith(base_model_name)]
    existing_models.sort()  # Sort to get the last version at the end

    if not existing_models:
        return base_model_name + "_v1"
    
    # Extract the last version number (ignoring the 'v'), increment it, and prepend 'v'
    last_version = int(existing_models[-1].split('_v')[-1])
    next_version = "v" + str(last_version + 1)

    return base_model_name + "_" + next_version

def start_training(training_data,model_name,scenario_id):

    
    class BertClassifier(tf.keras.Model):
        def __init__(self, num_classes,event_types, bert_model_name):
            super(BertClassifier, self).__init__()
            self.bert = TFAutoModel.from_pretrained(bert_model_name)
            self.bert.trainable = False
            self.dense = tf.keras.layers.Dense(num_classes, activation='softmax')
            self.custom_att = tf.Variable(event_types,trainable=False)
            
        def call(self, inputs, training=False):
            input_ids = inputs['input_ids']
            attn_masks = inputs['attention_mask']
            bert_embds = self.bert(input_ids, attention_mask=attn_masks)[1]
            outputs = self.dense(bert_embds)
            return outputs
        
    # Create a pandas dataframe using the dictionary

    df = pd.DataFrame(training_data.items(), columns=['context', 'event_type'])
    #Get the unique event_type values from your dataframe
    event_types = df['event_type'].unique()
    # event_types_sorted = sorted(event_types)
    
    print(event_types)
    
    # Convert the event_type column to a categorical column
    df['event_type_categorical'] = pd.Categorical(df['event_type'], categories=event_types)
    # Convert the categorical column to one-hot encoding using tf.keras.utils.to_categorical()
    labels = tf.keras.utils.to_categorical(df['event_type_categorical'].cat.codes, num_classes=len(event_types))
    
    # Creating a tokenizer object from the BERT-base-cased model
    tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
    # Setting the maximum sequence length for the tokenized input
    maxLength = 128
    # Defining a function to generate the training data
    def generate_training_data(df, ids, masks, tokenizer):
        for i, text in tqdm(enumerate(df['context'])):
            # Tokenizing the input text using the BERT tokenizer
            tokenized_text = tokenizer.encode_plus(
                text,
                max_length=maxLength,
                truncation=True,
                padding='max_length',
                add_special_tokens=True,
                return_tensors='tf'
            )
            # Storing the tokenized input and attention masks in numpy arrays
            ids[i, :] = tokenized_text.input_ids
            masks[i, :] = tokenized_text.attention_mask
        return ids, masks
    
    # Creating numpy arrays to store the tokenized input and attention masks
    X_input_ids = np.zeros((len(df), maxLength), dtype=np.int32)
    X_attn_masks = np.zeros((len(df), maxLength), dtype=np.int32)
    
    # Generating the training data using the generate_training_data function
    X_input_ids, X_attn_masks = generate_training_data(df, X_input_ids, X_attn_masks, tokenizer)
    
    # Creating a TensorFlow dataset object from the input and target data
    dataset = tf.data.Dataset.from_tensor_slices((X_input_ids, X_attn_masks, labels))
    
    # Defining a function to map the input and target data to the required format for the TensorFlow dataset
    def MapFunction(input_ids, attn_masks, labels):
        return {
            'input_ids': input_ids,
            'attention_mask': attn_masks
        }, labels
    
    # Mapping the dataset to the required format using the SentimentDatasetMapFunction
    dataset = dataset.map(MapFunction)
    # Shuffling and batching the dataset for training the model
    dataset = dataset.shuffle(len(df)).batch(4, drop_remainder=False)
    # Splitting the dataset into training and validation sets
    p = 0.9
    train_size = int((len(df) // 4) * p)
    train_dataset = dataset.take(train_size)
    val_dataset = dataset.skip(train_size)
    # Create model instance and compile
    model = BertClassifier(num_classes=len(event_types),event_types = event_types, bert_model_name='emilyalsentzer/Bio_ClinicalBERT')
    optimizer = tf.keras.optimizers.Adam(learning_rate=1e-5)
    loss_func = tf.keras.losses.CategoricalCrossentropy()
    accuracy_metric = tf.keras.metrics.CategoricalAccuracy('accuracy')
    model.compile(optimizer=optimizer, loss=loss_func, metrics=[accuracy_metric])
    # Train the model
    hist = model.fit(
        train_dataset,
        validation_data=val_dataset,
        epochs=10
    )
    # Get the next model name based on existing models
    model_version = get_next_model_name('Models', model_name, scenario_id)
    
    # Make sure the main directory ('Models' in this case) exists
    if not os.path.exists('Models'):
        os.makedirs('Models')
    
    # Make sure the scenario directory exists
    scenario_path = os.path.join('Models', str(scenario_id))
    if not os.path.exists(scenario_path):
        os.makedirs(scenario_path)
    
    # Save the trained model
    model_path = os.path.join(scenario_path, model_version)
    model.save(model_path)
    
    # Make a GET request to 'http://localhost:1338/saveTrainingInfo' to save training info
    url = 'http://localhost:1339/saveTrainingInfo'
    params = {'scenario_id': scenario_id,'model_version' : model_version}
    response = requests.get(url, params=params)
    ○
@app.route('/status-check', methods=['GET'])
def status_check():
    return '', 200
       
@app.route('/train-online', methods=['POST'])
def train_online():
    global t
    training_data = request.json.get('training_data')
    model_name = request.json.get('model_name')
    scenario_id = request.json.get('scenario_id')
    if t is None or not t.is_alive():
        t = threading.Thread(target=start_training, args = (training_data, model_name, scenario_id))
        t.start()

    return {'message': 'Training data received.'}
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006)
    