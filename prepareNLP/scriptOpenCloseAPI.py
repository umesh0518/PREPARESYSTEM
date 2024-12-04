# -*- coding: utf-8 -*-
"""
Created on Tue May 16 16:37:21 2023

@author: PrepareUser
"""

from flask import Flask
import subprocess
import os
import atexit
import psutil
from flask_cors import CORS


def kill_existing_process(script_name):
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        # Check if this is a 'python' process with the right command line
        if 'python' in proc.info['name']:
            if any(script_name in arg for arg in proc.info['cmdline']):
                print(f"Killing process {proc.pid} {proc.info['cmdline']}")
                proc.kill()  # Kill the process
            else:
                # Check child processes
                try:
                    for child in proc.children():
                        if any(script_name in arg for arg in child.cmdline()):
                            print(f"Killing child process {child.pid} {child.cmdline()}")
                            child.kill()  # Kill the child process
                except psutil.Error:
                    # Exception handling for access denied errors or a process being terminated before getting its children
                    pass


# Call the function at the start of your script
kill_existing_process('lookupSynonymMedicalAPI.py')
kill_existing_process('whisperTranscribeFFmpegNonThreadedAPI.py')
# kill_existing_process('whisperTranscribePrepareMulticastAPI.py')
# kill_existing_process('voskTranscribePrepareMulticastAPI.py')
kill_existing_process('onlineTrainingSubClassAPI.py')
# kill_existing_process('lookupEventDetectionDynamicAPI.py')
kill_existing_process('lookupEventDetectionDynamicSentimentAPI.py')


app = Flask(__name__)
CORS(app)
processes = {}
# Medical Synonyms API

@app.route('/open-medicalSynonyms')
def open_medicalSynonyms():
    if 'medicalSynonyms' in processes:
        return 'Medical Synonymn API is already running!'
    # Define the environment and the script
    env_path = r"c:\Users\spappad\AppData\local\miniconda3\envs\prepareNLP\python.exe"
    script_path = r"c:\Users\spappad\Documents\prepareNlpDeployment\prepareNLP\lookupSynonymMedicalAPI.py"

    process = subprocess.Popen([env_path, script_path], creationflags=subprocess.CREATE_NEW_CONSOLE | subprocess.CREATE_NEW_PROCESS_GROUP)
    processes['medicalSynonyms'] = {'process': process, 'pid': process.pid}
    print(processes)
    return 'Medical Synonymn API opened successfully!'

@app.route('/close-medicalSynonyms')
def close_medicalSynonyms():
    if 'medicalSynonyms' not in processes:
        return 'Medical Synonymn API is not running!'
    # Get the process
    process_info = processes['medicalSynonyms']
    pid = process_info['pid']
    
    
    # Kill the process
    try:
        os.system(f'taskkill /F /PID {pid}')
        processes.pop('medicalSynonyms')
        return 'Medical Synonymn API closed successfully!'
    except Exception as e:
        return f'Error while closing the process: {str(e)}'
    
# Listen Multicast Audio Stream API   

@app.route('/open-multicastTranscriptionStream')
def open_multicastTranscriptionStream():
    if 'multicastTranscriptionStream' in processes:
        return 'Multicast Stream API is already running!'

    # Define the environment and the script
    env_path = r"c:\Users\spappad\AppData\local\miniconda3\envs\prepareNLP\python.exe"
    script_path = r"c:\Users\spappad\Documents\prepareNlpDeployment\prepareNLP\whisperTranscribeFFmpegNonThreadedAPI.py"
    # script_path = r"c:\Users\spappad\Documents\prepareNlpDeployment\prepareNLP\whisperTranscribePrepareMulticastAPI.py"
    # script_path = r"c:\Users\spappad\Documents\prepareNlpDeployment\prepareNLP\voskTranscribePrepareMulticastAPI.py"

    process = subprocess.Popen([env_path, script_path], creationflags=subprocess.CREATE_NEW_CONSOLE | subprocess.CREATE_NEW_PROCESS_GROUP)
    processes['multicastTranscriptionStream'] = {'process': process, 'pid': process.pid}
    print(processes)
    return 'Multicast Stream API opened successfully!'

@app.route('/close-multicastTranscriptionStream')
def close_multicastTranscriptionStream():
    if 'multicastTranscriptionStream' not in processes:
        return 'Multicast Stream API is not running!'
    # Get the process
    process_info = processes['multicastTranscriptionStream']
    pid = process_info['pid']
    
    
    # Kill the process
    try:
        os.system(f'taskkill /F /PID {pid}')
        processes.pop('multicastTranscriptionStream')
        return 'Multicast Stream API closed successfully!'
    except Exception as e:
        return f'Error while closing the process: {str(e)}'
    
    
    
# Scenario Training API

@app.route('/open-scenarioTraining')
def open_scenarioTraining():
    if 'scenarioTraining' in processes:
        return 'Scenario Training API is already running!'

    # Define the environment and the script
    env_path = r"c:\Users\spappad\AppData\local\miniconda3\envs\prepareNLP\python.exe"
    script_path = r"c:\Users\spappad\Documents\prepareNlpDeployment\prepareNLP\onlineTrainingSubClassAPI.py"

    process = subprocess.Popen([env_path, script_path], creationflags=subprocess.CREATE_NEW_CONSOLE | subprocess.CREATE_NEW_PROCESS_GROUP)
    processes['scenarioTraining'] = {'process': process, 'pid': process.pid}
    print(processes)
    return 'Scenario Training API opened successfully!'

@app.route('/close-scenarioTraining')
def close_scenarioTraining():
    if 'scenarioTraining' not in processes:
        return 'Scenario Training API is not running!'
    # Get the process
    process_info = processes['scenarioTraining']
    pid = process_info['pid']
    
    
    # Kill the process
    try:
        os.system(f'taskkill /F /PID {pid}')
        processes.pop('scenarioTraining')
        return 'Scenario Training API closed successfully!'
    except Exception as e:
        return f'Error while closing the process: {str(e)}'

# Event Detection API

@app.route('/open-eventDetection')
def open_eventDetection():
    if 'eventDetection' in processes:
        return 'Event Detection API is already running!'

    # Define the environment and the script
    env_path = r"c:\Users\spappad\AppData\local\miniconda3\envs\prepareNLP\python.exe"
    # script_path = r"c:\Users\spappad\Documents\prepareNlpDeployment\prepareNLP\lookupEventDetectionDynamicAPI.py"
    script_path = r"c:\Users\spappad\Documents\prepareNlpDeployment\prepareNLP\lookupEventDetectionDynamicSentimentAPI.py"

    process = subprocess.Popen([env_path, script_path], creationflags=subprocess.CREATE_NEW_CONSOLE | subprocess.CREATE_NEW_PROCESS_GROUP)
    processes['eventDetection'] = {'process': process, 'pid': process.pid}
    print(processes)
    return 'Event Detection API opened successfully!'

@app.route('/close-eventDetection')
def close_eventDetection():
    if 'eventDetection' not in processes:
        return 'Event Detection API is not running!'
    # Get the process
    process_info = processes['eventDetection']
    pid = process_info['pid']
    
    
    # Kill the process
    try:
        os.system(f'taskkill /F /PID {pid}')
        processes.pop('eventDetection')
        return 'Event Detection API closed successfully!'
    except Exception as e:
        return f'Error while closing the process: {str(e)}'

    
# def shutdown():
#     for process_info in processes.values():
#         pid = process_info['pid']
#         os.system(f'taskkill /F /PID {pid}')
@atexit.register
def shutdown():
    # First try to terminate the processes using the stored PIDs
    for process_info in processes.values():
        pid = process_info['pid']
        if psutil.pid_exists(pid):
            p = psutil.Process(pid)
            p.terminate()  # or p.kill() if terminate() doesn't work
            
    # If there are any processes left, try to find and terminate them based on the script name
    kill_existing_process('lookupSynonymMedicalAPI.py')
    kill_existing_process('whisperTranscribeFFmpegNonThreadedAPI.py')
    # kill_existing_process('whisperTranscribePrepareMulticastAPI.py')
    # kill_existing_process('voskTranscribePrepareMulticastAPI.py')
    kill_existing_process('onlineTrainingSubClassAPI.py')
    # kill_existing_process('lookupEventDetectionDynamicAPI.py')
    kill_existing_process('lookupEventDetectionDynamicSentimentAPI.py')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
    
    
    
    
    

