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

@app.route('/')
def main():
	"""main page"""
	return render_template('index.html', titre = "Welcome !")

##### FOOD AGENCY #####
@app.route('/api/restaurants', methods=['GET'])
def get_all_restaurants():
	"""get all restaurants from food agency"""
	restaurant = mongo.db.restaurants

	restaurants = restaurant.aggregate([
		{'$project' : {
			'_id': 0,
			'properties.FHRSID' : '$FHRSID',
			'properties.name' : '$BusinessName',
			'properties.city' : '$AddressLine2',
  			'geometry.coordinates': ['$geocode.longitude', '$geocode.latitude'] 
		}}])
	
	restaurants = list(restaurants)
	for r in restaurants:
		r['geometry']['type'] = 'Point'
		r['type'] = 'Feature'

	return jsonify(restaurants)

@app.route('/api/restaurants/<int:id>', methods=['GET'])
def get_one_restaurants(id):
	"""get one restaurant from good agency using its id"""
	restaurant = mongo.db.restaurants
	
	restaurants = restaurant.aggregate([
		{'$match' : {'FHRSID' : id } },
		{'$project' : { 
			'_id': 0,
			'FHRSID' : '$FHRSID',
			'name' : '$BusinessName',
			'city' : '$AddressLine2',
  			'geometry.coordinates': ['$geocode.longitude', '$geocode.latitude'] 
		}}])

	restaurants = list(restaurants)
	for r in restaurants:
		r['geometry']['type'] = 'Point'
	
	return jsonify(restaurants)

##### YELP #####
@app.route('/api/yelp_restaurants', methods=['GET'])
def get_all_yelp_restaurants():
	"""get all restaurants from yelp"""
	yelp_restaurant = mongo.db.yelp_restaurants

	yelp_restaurants = yelp_restaurant.aggregate([
		{'$project' : {
			'_id': 0,
			'properties.name' : '$name',
			'properties.rating' : '$rating',
			'properties.review_count': '$review_count',
			'properties.categories': '$categories',
  			'geometry.coordinates': ['$longitude', '$latitude'] 
		}}])
	
	yelp_restaurants = list(yelp_restaurants)
	for r in yelp_restaurants:
		r['geometry']['type'] = 'Point'
		r['type'] = 'Feature'

	return jsonify(yelp_restaurants)


@app.route('/api/yelp_restaurants/rating', methods=['GET'])
def get_all_yelp_restaurants_rating():
	"""get all proccessed rating of all restaurants from yelp"""
	yelp_restaurant = mongo.db.yelp_restaurants

	star = yelp_restaurant.aggregate([
	 	{
	 		'$project': {
	    		'value': {
	      			'$subtract': ['$rating', {
	        			'$mod': ['$rating', 1]
	        		}]
	        	}
	        }
	    },
	  	{
	  		'$group': {
	    		'_id': '$value',
	    		'count': {'$sum': 1}
	    	}
	    },
	  	{
	  		'$project': {
	    		'_id': 0,
	    		'label': '$_id',
	    		'count': '$count'
	    	}
	    }
	])

	return jsonify(list(star))

##### TRIPADVISOR #####
@app.route('/api/tripadvisor_restaurants', methods=['GET'])
def get_all_tripadvisor_restaurants():
	"""get all restaurants from tripadvisor"""
	tripadvisor_restaurant = mongo.db.tripadvisor_restaurants

	tripadvisor_restaurants = tripadvisor_restaurant.aggregate([
		{'$project' : {
			'_id': 0,
			'properties.name' : '$name',
			'properties.rating' : '$rating',
			'properties.review_count': '$review_count',
			'properties.categories': '$category',
  			'geometry.coordinates': ['$location.longtitude', '$location.latitude'] 
		}}])
	
	tripadvisor_restaurants = list(tripadvisor_restaurants)
	for r in tripadvisor_restaurants:
		r['geometry']['type'] = 'Point'
		r['type'] = 'Feature'

	return jsonify(tripadvisor_restaurants)

@app.route('/api/tripadvisor_restaurants/rating', methods=['GET'])
def get_all_tripadvisor_restaurants_rating():
	"""get all proccessed rating of all restaurants from tripadvisor"""
	tripadvisor_restaurant = mongo.db.tripadvisor_restaurants

	star = tripadvisor_restaurant.aggregate([
	 	{
	 		'$project': {
	    		'value': {
	      			'$subtract': ['$rating', {
	        			'$mod': ['$rating', 1]
	        		}]
	        	}
	        }
	    },
	  	{
	  		'$group': {
	    		'_id': '$value',
	    		'count': {'$sum': 1}
	    	}
	    },
	  	{
	  		'$project': {
	    		'_id': 0,
	    		'label': '$_id',
	    		'count': '$count'
	    	}
	    }
	])

	return jsonify(list(star))


##### INSTAGRAM #####
@app.route('/api/instagram_food', methods=['GET'])
def get_instagram_food():
	'get all data from instagram'
	instagram_food = mongo.db.instagram_food

	myData = instagram_food.aggregate([
		{'$project' : {
			'_id': 0,
			'caption' : '$caption',
			'createdTime' : '$createdTime'
		}}])

	return jsonify(list(myData))

@app.route('/api/instagram_food/total_count', methods=['GET'])
def get_instagram_food_total_count():
	'get all total count from instagram'
	instagram_total_count = mongo.db.instagram_total_count

	myData = instagram_total_count.aggregate([
		{'$project' : {
			'_id': 0,
			'foodType' : '$foodType',
			'count' : '$count'
		}}])

	return jsonify(list(myData))

@app.route('/api/instagram_food/time_count', methods=['GET'])
def get_instagram_food_time_count():
	'get time count from instagram'
	instagram_time_count = mongo.db.instagram_time_count

	myData = instagram_time_count.aggregate([
		{'$project' : {
			'_id': 0,
			'foodType' : '$foodType',
			'count' : '$count',
			'createdTime' : '$time'
		}}])

	return jsonify(list(myData))


##### TWITTER #####
@app.route('/api/twitter_vegan', methods=['GET'])
def get_twitter_vegan():
	'get all data from twitter_vegan'
	twitter_vegan = mongo.db.twitter_vegan

	myData = twitter_vegan.aggregate([
		{'$project' : {
			'_id': 0,
			'caption' : '$text',
			'createdTime' : '$time'
		}}])

	myData = list(myData)
	
	for r in myData:
		r['foodType'] = "vegan"

	return jsonify(myData)

@app.route('/api/twitter_coffee', methods=['GET'])
def get_twitter_coffee():
	'get all data from twitter_coffee'
	twitter_coffee = mongo.db.twitter_coffee

	myData = twitter_coffee.aggregate([
		{'$project' : {
			'_id': 0,
			'caption' : '$text',
			'createdTime' : '$time'
		}}])
	
	myData = list(myData)
	
	for r in myData:
		r['foodType'] = "coffee"

	return jsonify(myData)

@app.route('/api/twitter_tea', methods=['GET'])
def get_twitter_tea():
	'get all data from twitter_tea'
	twitter_tea = mongo.db.twitter_tea

	myData = twitter_tea.aggregate([
		{'$project' : {
			'_id': 0,
			'caption' : '$text',
			'createdTime' : '$time'
		}}])

	myData = list(myData)
	
	for r in myData:
		r['foodType'] = "tea"

	return jsonify(myData)

@app.route('/api/twitter_burger', methods=['GET'])
def get_twitter_burger():
	'get all data from twitter_burger'
	twitter_burger = mongo.db.twitter_burger

	myData = twitter_burger.aggregate([
		{'$project' : {
			'_id': 0,
			'caption' : '$text',
			'createdTime' : '$time'
		}}])

	myData = list(myData)
	
	for r in myData:
		r['foodType'] = "burger"

	return jsonify(myData)

@app.route('/api/twitter_pizza', methods=['GET'])
def get_twitter_pizza():
	'get all data from twitter_pizza'
	twitter_pizza = mongo.db.twitter_pizza

	myData = twitter_pizza.aggregate([
		{'$project' : {
			'_id': 0,
			'caption' : '$text',
			'createdTime' : '$time'
		}}])

	myData = list(myData)
	
	for r in myData:
		r['foodType'] = "pizza"

	return jsonify(myData)

##### OPENLAYERS #####
@app.route('/css/lib/openlayers.css')
def get_openlayers_css():
	"""Openlayers needs its css file ..."""
	return redirect(url_for('static', filename='css/lib/openlayers.css'))


if __name__ == '__main__':
	app.run(debug=True)

