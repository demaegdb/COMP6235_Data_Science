# COMP6235_Data_Science
## 1 - Description
The project is called «Secrets of successful restaurants» and aims at helping someone who would like to open a restaurant in Southampton. It should be considered as a helpful tool that can simplify a market study for an entrepreneur.
There are two main parts in this project. The first one is about collecting data from rating websites (Yelp & TripAdvisor) in order to create a map that can help to study potential competitors (location of restaurants ; cuisine ; rating ; number of reviews). The second one is to collect data from social networks to try to find out some food trends in Southampton. For example, the application counts how many times some keywords (pizza ; burger ; vegan...) appear each month between 28/09/2015 and 10/01/2017 on public instagram posts from Southampton. It then displays a graph with all curves linked to these keywords.
These two parts combined give an overview of what is already existing (competitors) and what potential future clients are thinking about food. This is why it can be useful for an entrepreneur who would like to open a restaurant, even if it does not aim at fully replace the market study.

## 2 - Setting up the application
* install mongoDB
* install the following python packages : flask; Flask-PyMongo; requests; yelp
* create a file named "config_secret.json", copy/paste the following code (with your own key & token) and place it into the "/data" directory.

{
    "consumer_key": "YOUR_CONSUMER_KEY",
    "consumer_secret": "YOUR_CONSUMER_SECRET",
    "token": "YOUR_TOKEN",
    "token_secret": "YOUR_TOKEN_SECRET"
}
* download the following file (which is too big to be hosted on gitHub) and place it into "/data/data_files"
https://drive.google.com/file/d/0B4FNtfw1DR3OdEVEM2tpTzJCVmM/view?usp=sharing
* get into the directory "/data" and type the following commands :
  * python insert_food_agency.py
  * python insert_yelp.py
  * python insert_tripadvisor.py
  * python insert_twitter.py
  * python insert_instagram.py

* go to the top-level of the app and run :
  * python app.py

* connect to :
  * http://localhost:5000/
