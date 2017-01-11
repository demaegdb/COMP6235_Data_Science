# -*- coding:utf-8 -*-
import json
import time


def timestamp_to_date(timestamp_str):
    timestamp = float(timestamp_str)
    timeArray = time.localtime(timestamp)
    ret_date = time.strftime("%B %Y", timeArray)
    return ret_date


def add_or_update_result_list(food_type, data_str):
    if ret_list == 0:
        ret_list.append(dict(foodType=food_type, time=data_str, count=1))
    else:
        is_exist = False
        for record in ret_list:
            if record['foodType'] == food_type and record['time'] == data_str:
                record['count'] += 1
                is_exist = True
                break
        if is_exist == False:
            ret_list.append(dict(foodType=food_type, time=data_str, count=1))


food_type = ['pizza', 'burger', 'coffee', 'tea', 'vegan']
ret_list = []
with open('instgram_food.json') as data_file:
    data = json.load(data_file)
    i = 0
    for d in data:
        caption = d['caption']
        create_time = d['createdTime']
        is_type_exist = False
        for ft in food_type:
            if caption and caption.find(ft) != -1:
                add_or_update_result_list(ft, timestamp_to_date(create_time))
                is_type_exist = True
                break
        if is_type_exist == False:
            add_or_update_result_list('None', timestamp_to_date(create_time))

print ret_list
