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
data_csv = pd.read_csv('../data/all-nodes.csv')

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")

@app.route('/favicon.ico',methods=['GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'connection.png', mimetype='image/connection.png')

def init():
    data_csv = pd.read_csv('../data/all-nodes.csv')
    print(data_csv.shape)
    pass

@app.route('/getnodes',methods=['GET'])
def get_nodes():
    catName = request.args.get("catName", None)
    # add var for previous
    print("catName :::::",catName)
    if catName is not None:
        print("Processing...")
        try:
            data_dict = data_for_plot(catName)
            return jsonify(data_dict)
        except Exception as e:
            print(e)
            return jsonify({"error":"error"})
            raise(e)
    else:
        return {"error":"error"}


def find_all_ancestors(id):
    child = []
    while id != None:
        cat_name = data_csv.name[data_csv.id == id].values[0]
        parent_id = data_csv.parent[data_csv.id == id].values[0]
        productCount = data_csv.subtreeProductCount[data_csv.id == id].values[0]

        ancestors = {}
        ancestors['id'] = int(id)
        ancestors['name'] = cat_name
        ancestors['value'] = int(productCount)
        ancestors['children'] = child
        child = [ancestors]
#         print(id,cat_name)
        id = parent_id
        if id == 0:
#             print(id,'root')
            ancestors = {}
            ancestors['id'] = 0
            ancestors['name'] = 'All Categories'
            ancestors['value'] = int(0)
            ancestors['children'] = child
            return ancestors
            break

def find_all_hierarchy(cat_name):
    all_hierarchy = []
    print(data_csv.shape)
    all_cat_ids = data_csv.id.loc[data_csv.name == cat_name].values
    for cat_id in all_cat_ids:
        hierarchy = find_all_ancestors(cat_id)
        all_hierarchy.append(hierarchy)
#         print("#####"*20)
    return all_hierarchy

def merge_trees(main_tree, side_tree):
    '''Given two trees (a main tree and a side tree having only max one child) ,
    it merges them and returns the merged tree'''
    #pprint.pprint(main_tree)
    #pprint.pprint(side_tree)
    if len(main_tree) == 0:
        return side_tree
    main_children = main_tree['children']
    side_child = side_tree['children'][0]
    if side_child == None:
        return main_tree
    if main_children[0] == None:
        return side_tree
    children_ids = [c['id'] for c in main_children]
    if side_child != None and side_child['id'] in children_ids:
#         print(side_child['id'],children_ids)
#         print(np.argwhere(np.array(children_ids) == side_child['id'])[0][0])
#         print('--'*10)
        idx = np.argwhere(np.array(children_ids) == side_child['id'])[0][0]
        child_merged =  merge_trees(main_tree['children'][idx],side_child)
        main_tree['children'][idx] = child_merged
        return main_tree
    else:
        main_tree['children'].append(side_tree['children'][0])
        #pprint.pprint(main_tree)
        return main_tree

def merge_all_trees(all_trees):
    merged_tree = {}
    for tree in all_trees:
        merged_tree = merge_trees(merged_tree,tree)
    return merged_tree

def data_for_plot(catName):
    all_trees = find_all_hierarchy(catName)
    merged_tree = merge_all_trees(all_trees)
    return merged_tree

if __name__ == '__main__':
    init();
    os.environ["FLASK_ENV"] = 'development'
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)