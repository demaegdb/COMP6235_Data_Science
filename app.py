#! /usr/bin/python
# -*- coding:utf-8 -*-
from flask import Flask
from flask import jsonify
from flask import render_template
from flask.ext.pymongo import PyMongo

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'data_science'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/data_science'

# connect to MongoDB with the defaults
mongo = PyMongo(app)

# main page
@app.route('/')
def main():
	return render_template('index.html', titre = "Welcome !")

# get all restaurants
@app.route('/api/restaurants', methods=['GET'])
def get_all_restaurants():
	restaurant = mongo.db.restaurants
	output = []
	for r in restaurant.find():
		output.append({"name" : r["BusinessName"], "FHRSID" : r["FHRSID"], "city" : r["AddressLine2"], "latitude" : r["geocode"]["latitude"], "longitude" : r["geocode"]["longitude"]})
	return jsonify({"result" : output})

# get one restaurant using its id
@app.route('/api/restaurants/<int:id>', methods=['GET'])
def get_one_restaurants(id):
	restaurant = mongo.db.restaurants
	output = []
	r = restaurant.find_one_or_404({"FHRSID" : id })
	output.append({'name' : r['BusinessName'], "city" : r['AddressLine2'], "latitude" : r['geocode']['latitude'], "longitude" : r['geocode']['longitude']})
	return jsonify({"result" : output})


if __name__ == '__main__':
	app.run(debug=True)

