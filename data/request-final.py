import requests
import json
import re
from bs4 import BeautifulSoup
data = ""

r = requests.get("https://www.tripadvisor.co.uk/Restaurants-g186299-oa570-Southampton_Hampshire_England.html#EATERY_OVERVIEW_BOX")
soup = BeautifulSoup(r.content)
info = soup.find_all("div",{"class": "shortSellDetails"})
name = soup.find_all("a",{"class": "property_title"})
category = soup.find_all("div",{"class": "cuisines"})
"""image = soup.find_all("img",{"class": "photo_image"})"""
"""image = soup.find_all("div",{"class": "photo_booking"})"""
rating = soup.find_all("img",{"class": "sprite-ratings"})
type_trigger = 0
for x in range(0, len(name)):
    print "Name : "
    print name[x].text.strip()
    t_name = name[x].text.strip()
    print "Type: "
    if(t_name=="Sunshine Valley" or t_name=="Pizza Hut" or t_name=="Magic Wok" or t_name=="Riverside Diner" or t_name=="The Hayrack Cafe" or t_name=="The Cafe at SUSU" or t_name=="Hunters Grill" or t_name=="Happy Garden" or t_name=="Peking Garden" or t_name=="Mitchell's Kitchen and Bars" or t_name=="Plested Pies" or t_name=="Sweet & Sour" or t_name=="Portobello Pizza"):
        type_trigger = type_trigger-1
        string_type = "null"
    else:
        print x+type_trigger
        subtype = category[x+type_trigger].find_all("a",{"class": "cuisine"})
        string_type = ""
        for y in range(0,len(subtype)):
            print subtype[y].text
            if(y!=0):
                string_type = string_type + ',' + subtype[y].text
            else:
                string_type = subtype[y].text
    rate = re.search('(.+?) of', rating[x]["alt"])
    rate = rate.group(1)
    print rate
    if(t_name=="The Wheatsheaf"):
        location_array = ['null','null']
    else:
        location = soup.find_all("a",{"id": "restmap"+str(x+1)})
        location_array = re.findall("\d+\.\d+", str(location))
    print "Location : "
    print location_array
    """print "Image: "
    print image[x]["src"]"""
    data = data + "{"
    data = data + '\n\t' + '"name" : "' + name[x].text.strip() + '",'
    data = data + '\n\t' + '"category" : "' + string_type + '",'
    data = data + '\n\t' + '"rating" : "' + rate + '",'
    if(t_name!="Chilli Tandoori" and t_name!="Asia Wok" and t_name!="Jasmine Garden" and t_name!="McDonald's" and t_name!="The Chambers" and t_name!="Fat Jackets"):
        data = data + '\n\t' + '"location" : {\n\t\t"latitude" : ' + location_array[0] + '\n\t\t"longtitude" : ' + location_array[1] + '\n\t}'
    else:
        data = data + '\n\t' + '"location" : {\n\t\t"latitude" : ' + 'null' + '\n\t\t"longtitude" : ' + 'null' + '\n\t}'
    """data = data + '\n\t' + '"photo" : "' + image[x]["src"] + '"'"""
    """data = data + '\n\t' + '"photo" : "' + image[x].text + '"'"""
    data = data + "\n" + '},' + "\n"
    """data = {}
    data['name'] = name[x].text.strip()
    data['category'] = string_type
    data['photo'] = image[x]["src"]
    json_data = json.dumps(data)
    with open('data.txt', 'w') as f:
        json.dump(json_data, f, ensure_ascii=False)"""
    print '\n'

with open('result20.txt', 'w') as f:
    json.dump(data, f)
