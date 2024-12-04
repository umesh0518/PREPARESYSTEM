# -*- coding: utf-8 -*-
"""
Created on Mon Jul 17 11:29:07 2023

@author: ppaudel3
"""

import threading
import json
import pandas as pd
import numpy as np
from tqdm.auto import tqdm
import tensorflow as tf
from transformers import AutoTokenizer, TFAutoModel

    
class BertClassifier(tf.keras.Model):
    def __init__(self, num_classes,event_types, bert_model_name):
        super(BertClassifier, self).__init__()
        self.bert = TFAutoModel.from_pretrained(bert_model_name)
        self.dense = tf.keras.layers.Dense(num_classes, activation='softmax')
        self.custom_att = tf.Variable(event_types,trainable=False)
        
    def call(self, inputs, training=False):
        input_ids = inputs['input_ids']
        attn_masks = inputs['attention_mask']
        bert_embds = self.bert(input_ids, attention_mask=attn_masks)[1]
        outputs = self.dense(bert_embds)
        return outputs
    
# Create a pandas dataframe using the dictionary

df = pd.read_csv('sentimentDatasetPrepare/train.txt', delimiter=';', names=['context', 'event_type'])
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
dataset = dataset.shuffle(len(df)).batch(32, drop_remainder=False)
# Splitting the dataset into training and validation sets
p = 0.9
train_size = int((len(df) // 32) * p)
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
    epochs=15
)
# save the model using saved_model
tf.saved_model.save(model, 'sentimentModelPrepare')

#Test Accuracy.

# Load the test data
# df_test = pd.read_csv('sentimentDatasetPrepare/val.txt', delimiter=';', names=['context', 'event_type'])

# # Convert the event_type column to one-hot encoding
# df_test['event_type_categorical'] = pd.Categorical(df_test['event_type'], categories=event_types)
# labels_test = tf.keras.utils.to_categorical(df_test['event_type_categorical'].cat.codes, num_classes=len(event_types))

# # Create numpy arrays to store the tokenized input and attention masks
# X_input_ids_test = np.zeros((len(df_test), maxLength), dtype=np.int32)
# X_attn_masks_test = np.zeros((len(df_test), maxLength), dtype=np.int32)

# # Tokenize the test data
# X_input_ids_test, X_attn_masks_test = generate_training_data(df_test, X_input_ids_test, X_attn_masks_test, tokenizer)

# # Create a TensorFlow dataset object from the test data
# dataset_test = tf.data.Dataset.from_tensor_slices((X_input_ids_test, X_attn_masks_test, labels_test))

# # Map the dataset
# dataset_test = dataset_test.map(MapFunction)

# # Batch the dataset
# dataset_test = dataset_test.batch(32, drop_remainder=False)

# # Evaluate the model on the test data
# loss_test, accuracy_test = model.evaluate(dataset_test)

# print(f'Test Loss: {loss_test}')
# print(f'Test Accuracy: {accuracy_test}')

