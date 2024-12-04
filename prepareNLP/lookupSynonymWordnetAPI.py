# -*- coding: utf-8 -*-
"""
Created on Thu Mar 16 15:12:01 2023

@author: Prepare User

"""

#API  which receives the POST request of look up words and send backs the synonyms of those words

#First run these command to download the wordnet data
# import nltk
# nltk.download('wordnet')

from flask import Flask, request, jsonify
from nltk.corpus import wordnet

app = Flask(__name__)

@app.route('/get-synonyms', methods=['POST'])

def get_synonyms():

    # lookup_dict = {
    #     'bad': 'Negative',
    #     'awful': 'Negative',
    #     'terrible': 'Negative',
    #     'disappointing' : 'A bit negative',
    #     'helpless' : 'A bit negative',
    #     'okay' : 'Neutral',
    #     'average' : 'Neutral',
    #     'good' : 'A bit positive' ,
    #     'nice' : 'A bit positive',
    #     'promising' : 'A bit positive' ,
    #     'excellent' : 'Positive',
    #     'outstanding' : 'Positive',
    #     'spectacular' : 'Positive',
    # }
    lookup_dict = request.json.get('lookup_dict')
    synonyms = {}
    for key, value in lookup_dict.items():
        for syn in wordnet.synsets(key)[:1]:
            for lemma in syn.lemmas():
                synonyms[lemma.name().lower()] = value
    print('something is being done')
    return jsonify({"lookup_dict":synonyms})
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5009)
    
    








    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
