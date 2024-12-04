# -*- coding: utf-8 -*-
"""
Created on Tue Mar 28 21:29:18 2023

@author: Prepare User
"""

#API  which receives the POST request of look up words and send backs the synonyms of those words

from flask import Flask, request, jsonify
from pymedtermino import *
from pymedtermino.snomedct import *
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/status-check', methods=['GET'])
def status_check():
    return '', 200


@app.route('/get-medical-synonyms', methods=['POST'])
def get_medical_synonyms():

    # lookup_dict = {
    #     'medical history': 'Event 1',
    #     'sepsis': 'Event 2',
    #     'heart attack': 'Event 3',
    # }
    lookup_dict = request.json.get('lookup_dict')
    print(lookup_dict)
    
    synonyms = {}
    for key, value in lookup_dict.items():
        #Note: [0:5] lists out only 1st five synonyms. For more increase the value of stop index
        results = SNOMEDCT.search(key)[0:5]
        for r in results:
            text = str(r).split('#')[1].strip()
            synonyms[text.lower()] = value
    return jsonify({"lookup_dict":synonyms})




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004)





