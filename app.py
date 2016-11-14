#! /usr/bin/python
# -*- coding:utf-8 -*-
from flask import Flask
from flask import jsonify
from flask import render_template
from flask.ext.pymongo import PyMongo

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'test'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/test'

# connect to MongoDB with the defaults
mongo = PyMongo(app)

# Welcome page (example)
@app.route('/')
def welcome():
	return render_template('welcome.html', titre = "Welcome !")

# get all restaurants
@app.route('/restaurants', methods=['GET'])
def get_all_restaurants():
	restaurant = mongo.db.restaurants
	output = []
	for r in restaurant.find():
		output.append({'name' : r['name'], "cuisine" : r['cuisine'], "id" : r['restaurant_id']})
	return jsonify({"result" : output})

# get one restaurant using its id
@app.route('/restaurants/<id>', methods=['GET'])
def get_one_restaurants(id):
	restaurant = mongo.db.restaurants
	output = []
	r = restaurant.find_one_or_404({'restaurant_id' : str(id) })
	output.append({'name' : r['name'], "cuisine" : r['cuisine'], "id" : r['restaurant_id']})
	return jsonify({"result" : output})


if __name__ == '__main__':
	app.run(debug=True)

