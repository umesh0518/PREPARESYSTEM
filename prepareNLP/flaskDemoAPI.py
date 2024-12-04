 # -*- coding: utf-8 -*-
"""
Created on Mon Mar 13 13:37:14 2023

@author: Prepare User
"""

from flask import Flask,request

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello World</p>"

    
    
@app.route('/set-multicast-group', methods=['POST'])
def set_socket():
    global MULTICAST_GROUP, PORT, s
    MULTICAST_GROUP = request.json.get('multicast_group')
    PORT = request.json.get('port')
    print(MULTICAST_GROUP, type(MULTICAST_GROUP))
    print(PORT, type(PORT))
    return {'message': 'Socket settings updated.'}

app.run(host='0.0.0.0', port=5010)
# if __name__ == '__main__':
#     app.run(debug=True, use_reloader = True)