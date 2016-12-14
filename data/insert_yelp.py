import json
from yelp.client import Client
from yelp.oauth1_authenticator import Oauth1Authenticator
from pymongo import MongoClient


# get all yelp restaurants in Southampton #
def get_yelp_restaurants():

    # read API keys ** secret **
    with open('config_secret.json') as cred:
        creds = json.load(cred)
        auth = Oauth1Authenticator(**creds)
        client = Client(auth)

    # query
    final_result = []

    params = {
        'term': 'restaurants',
        'offset': 0,
    }

    search_results = client.search('Southampton', **params)
    for r in search_results.businesses:
        mydata = {}
        mydata['name'] = r.name
        mydata['rating'] = r.rating
        mydata['review_count'] = r.review_count
        mydata['latitude'] = r.location.coordinate.latitude
        mydata['longitude'] = r.location.coordinate.longitude
        final_result.append(mydata)


    while search_results and params['offset'] < 840:
        params['offset'] += 20
        search_results = client.search('Southampton', **params)
        for r in search_results.businesses:
            mydata = {}
            mydata['name'] = r.name
            mydata['rating'] = r.rating
            mydata['review_count'] = r.review_count
            mydata['latitude'] = r.location.coordinate.latitude
            mydata['longitude'] = r.location.coordinate.longitude
            final_result.append(mydata)

    return final_result


# insert data into mongoDB #
def insert_data():

    # get the json from yelp API
    myYelpRestaurants = get_yelp_restaurants()

    # connect to mongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client["data_science"]
    db.yelp_restaurants.drop()
    collection = db["yelp_restaurants"]

    # insert all restaurants into mongoDB
    for r in myYelpRestaurants:
        collection.insert(r)


### main ###
insert_data()


