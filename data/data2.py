from yelp.client import Client
from yelp.oauth1_authenticator import Oauth1Authenticator

import json

# read API keys
with open('config_secret.json') as cred:
    creds = json.load(cred)
    auth = Oauth1Authenticator(**creds)
    client = Client(auth)

# query
params = {
    'term': 'food',
    'lang': 'fr'
}

# r ->  response
r = client.search('San Francisco', **params)

print(r.businesses)