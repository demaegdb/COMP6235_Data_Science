import json
from pymongo import MongoClient

# import json file
def import_json(name):
	with open('data_files/' + name) as mydata:
		d = json.load(mydata)
		return d

# insert data into mongoDB
def insert_data():

	# get the json file containing the data
	myTripAdvisorRestaurants = import_json('tripadvisor_restaurants.json')

	# connect to mongoDB
	client = MongoClient('mongodb://localhost:27017/')
	db = client["data_science"]
	db.tripadvisor_restaurants.drop()
	collection = db["tripadvisor_restaurants"]

    # insert all restaurants into mongoDB
	for r in myTripAdvisorRestaurants:
		collection.insert(r)


### main ###
insert_data()
