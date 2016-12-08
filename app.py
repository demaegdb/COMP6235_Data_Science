#! /usr/bin/python
# -*- coding:utf-8 -*-
from flask import Flask
from flask import jsonify
from flask import redirect, url_for
from flask import render_template
from flask.ext.pymongo import PyMongo
import bson
from bson import json_util
from flask.json import JSONEncoder


app = Flask(__name__)

## mongo use BSON, not JSON ##
class BSONEncoder(JSONEncoder):
    def default(self, o):
        return bson.json_util.default(o)


app.json_encoder = BSONEncoder

app.config['MONGO_DBNAME'] = 'data_science'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/data_science'

# connect to MongoDB with the defaults
mongo = PyMongo(app)

# main page
@app.route('/')
def main():
	return render_template('index.html', titre = "Welcome !")

## API ##
# get all restaurants
@app.route('/api/restaurants', methods=['GET'])
def get_all_restaurants():
	restaurant = mongo.db.restaurants

	restaurants = restaurant.aggregate([
		{'$project' : {
			'_id': 0,
			'FHRSID' : '$FHRSID',
			'name' : '$BusinessName',
			'city' : '$AddressLine2',
  			'geometry.coordinates': ['$geocode.latitude', '$geocode.longitude'] 
		}}])
	
	restaurants = list(restaurants)
	for r in restaurants:
		r['geometry']['type'] = 'Point'

	return jsonify(restaurants)

# get one restaurant using its id
@app.route('/api/restaurants/<int:id>', methods=['GET'])
def get_one_restaurants(id):
	restaurant = mongo.db.restaurants
	
	restaurants = restaurant.aggregate([
		{'$match' : {'FHRSID' : id } },
		{'$project' : { 
			'_id': 0,
			'FHRSID' : '$FHRSID',
			'name' : '$BusinessName',
			'city' : '$AddressLine2',
  			'geometry.coordinates': ['$geocode.latitude', '$geocode.longitude'] 
		}}])

	restaurants = list(restaurants)
	for r in restaurants:
		r['geometry']['type'] = 'Point'
	
	return jsonify(restaurants)

## Openlayers needs its css file ... ##
@app.route('/css/lib/openlayers.css')
def get_openlayers_css():
	return redirect(url_for('static', filename='css/lib/openlayers.css'))


if __name__ == '__main__':
	app.run(debug=True)

