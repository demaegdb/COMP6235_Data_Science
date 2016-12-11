import json
import requests
from pymongo import MongoClient

# get all establishments in southampton #
def get_establishment_ids():
    
    url = 'http://api.ratings.food.gov.uk/Establishments?localAuthorityId=288&countryId=1'
    headers = {'x-api-version': '2', 'accept': 'application/json'}
    r = requests.get(url, headers=headers)
    return r.json()

# insert data into mongoDB #
def insert_data():

	myEstablishments = get_establishment_ids()['establishments']

	client = MongoClient('mongodb://localhost:27017/')
	db = client["data_science"]
	db.restaurants.drop()
	collection = db["restaurants"]

	for establishment in myEstablishments:
		collection.insert(establishment)


### main ###
insert_data()







	