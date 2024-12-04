# -*- coding: utf-8 -*-
"""
Created on Mon Apr  3 10:42:54 2023

@author: Prepare User
"""
import threading
import json
import pandas as pd
import numpy as np
from tqdm.auto import tqdm
import tensorflow as tf
from transformers import AutoTokenizer, TFAutoModel

from flask import Flask,request

app = Flask(__name__)

t = None  # Thread will be started in start_training function

def start_training(training_data):
    # Create a pandas dataframe using the dictionary
    df = pd.DataFrame(training_data.items(), columns=['context', 'event_type'])
    
    # Get the unique event_type values from your dataframe
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
    
    # Creating a BERT model object and defining the input layers
    BertModel = TFAutoModel.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
    input_ids = tf.keras.layers.Input(shape=(maxLength,), name='input_ids', dtype='int32')
    attn_masks = tf.keras.layers.Input(shape=(maxLength,), name='attention_mask', dtype='int32')
    
    # Feeding the input layers to the BERT model and adding a dense layer and output layer
    bert_embds = BertModel.bert(input_ids, attention_mask=attn_masks)[1]
    output_layer = tf.keras.layers.Dense(len(event_types), activation='softmax', name='output_layer')(bert_embds)
    # Creating a TensorFlow model object with the input and output layers
    model = tf.keras.Model(inputs=[input_ids, attn_masks], outputs=output_layer)
    optim = tf.keras.optimizers.Adam(learning_rate=1e-5)
    loss_func = tf.keras.losses.CategoricalCrossentropy()
    acc = tf.keras.metrics.CategoricalAccuracy('accuracy')
    model.compile(optimizer=optim, loss=loss_func, metrics=[acc])
    hist = model.fit(
        train_dataset,
        validation_data=val_dataset,
        epochs = 10
    )
    # model.save('phee_model.h5')
    model.save('phee_model.h5')
        
@app.route('/train-online', methods=['POST'])
def train_online():
    global t
    training_data = request.json.get('training_data')
    if t is None or not t.is_alive():
        t = threading.Thread(target=start_training, args = (training_data ,))
        t.start()
    return {'message': 'Training data received.'}
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)
    