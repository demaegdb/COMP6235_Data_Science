import json
from pymongo import MongoClient

# import json file
def import_json(name):
	with open('data_files' + name) as mydata:
		d = json.load(mydata)
		return d

# insert data into mongoDB
def insert_data():

	# get the json file containing the data
	myInstagramFood = import_json('instagram_food.json')

	# connect to mongoDB
	client = MongoClient('mongodb://localhost:27017/')
	db = client["data_science"]
	db.instagram_food.drop()
	collection = db["instagram_food"]

    # insert all restaurants into mongoDB
	for r in myInstagramFood:
		collection.insert(r)

### main ###
insert_data()