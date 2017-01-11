import json
from pymongo import MongoClient

# import json file
def import_json(name):
	with open('data_files/' + name) as mydata:
		d = json.load(mydata)
		return d

# insert data into mongoDB
def insert_data(dataName):

	dataName = "instagram_" + dataName
	# get the json file containing the data
	myInstagramFood = import_json(dataName + '.json')

	# connect to mongoDB
	client = MongoClient('mongodb://localhost:27017/')
	db = client["data_science"]
	db[dataName].drop()
	collection = db[dataName]

    # insert all restaurants into mongoDB
	for r in myInstagramFood:
		collection.insert(r)

### main ###
insert_data('food')

insert_data('total_count')
insert_data('time_count')