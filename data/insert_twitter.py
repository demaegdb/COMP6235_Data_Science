import json
from pymongo import MongoClient

# import json file
def import_json(name):
	with open("data_files/" + name) as mydata:
		d = json.load(mydata)
		return d

# insert data into mongoDB
def insert_data(typeFood):

	name = "twitter_" + typeFood

	# get the json file containing the data
	myTwitterFood = import_json(name + ".json")

	# connect to mongoDB
	client = MongoClient('mongodb://localhost:27017/')
	db = client["data_science"]
	db[name].drop()
	collection = db[name]

    # insert all restaurants into mongoDB
	for r in myTwitterFood:
		collection.insert(r)

### main ###
insert_data('tea')
insert_data('vegan')
insert_data('pizza')
insert_data('burger')
insert_data('coffee')