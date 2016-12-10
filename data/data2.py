from yelp.client import Client
from yelp.oauth1_authenticator import Oauth1Authenticator

import json

# read API keys
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
	final_result.append(r.name)


while search_results and params['offset'] < 980:
    params['offset'] += 20
    print(len(final_result))
    search_results = client.search('Southampton', **params)
    for r in search_results.businesses:
		final_result.append(r.name)


print(final_result)