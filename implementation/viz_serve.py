import os
from os import path
import numpy as np
import pandas as pd
import json
from collections import Counter
import random

from flask import Flask,escape,request,render_template,send_from_directory
from flask.json import jsonify

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

# FILE_PATH = "/Users/chitrasen/workspace_python/class_works/CS765/"
FILE_PATH = "data/"
print("loading data from file")
cd_data = None

data_cache = {}
ratting_cache = {}
print("data loaded")

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")

@app.route('/favicon.ico',methods=['GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'connection.png', mimetype='image/connection.png')

def init():
    #cd_data = pd.read_csv(path.join(FILE_PATH,"Musical_Instruments_5.csv.gz"))
    pass



if __name__ == '__main__':
    init();
    os.environ["FLASK_ENV"] = 'development'
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
