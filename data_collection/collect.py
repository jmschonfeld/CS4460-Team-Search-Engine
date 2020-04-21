from pytrends.request import TrendReq
import json
import datetime
from dateutil.rrule import rrule, WEEKLY
from pprint import pprint
from datetime import timedelta

#DO NOT RUN SCRIPT I MAY OVERWRITE DATA

def bubble_data():
    pytrends = TrendReq(hl='en-US', tz=360)

    initial_keywords = ['obesity', 'diet', 'exercise', 'disease', 'cancer']
    keywords = {}
    pytrends.build_payload(kw_list=initial_keywords)

    print('Fecthing Related Terms')

    related = pytrends.related_queries()
    related_data = [related[x]['top'][:5].to_numpy() for x in related]
    related_terms = [x[:,0] for x in related_data]

    print('Related Terms obtained')

    for x in range(len(initial_keywords)):
        keywords[initial_keywords[x]] = related_terms[x].tolist()

    print('Getting related Terms')
    for x in keywords.copy():
        subkeywords = keywords[x]
        pytrends.build_payload(kw_list=subkeywords)
        related = pytrends.related_queries()
        related_data = [related[x]['top'][:3].to_numpy() for x in related]
        related_terms = [x[:,0] for x in related_data]
        for i in range(len(subkeywords)):
            keywords[x].extend(related_terms[i].tolist())
    print('Related terms obtained')

    data = {}

    for keyword in keywords:
        subkeywords = keywords[keyword]
        data[keyword] = {}

        chunkedList = list()
        for index in range(5, len(subkeywords) + 1, 5):
            chunkedList.append(subkeywords[index - 5:index])

        for currList in chunkedList:
            if len(currList) > 0:
                currList = list(dict.fromkeys(currList))
                print(currList)
                pytrends.build_payload(kw_list=currList)
                interest = pytrends.interest_over_time()

                for subkey in currList:
                    interest_data = {interest.index[x].strftime("%m/%d/%Y"): int(interest[subkey][x]) for x in range(len(interest))}
                    data[keyword][subkey] = interest_data
                    data[keyword][subkey]['start_date'] = interest.index[0].strftime("%m/%d/%Y")
                    data[keyword][subkey]['end_date'] = interest.index[len(interest) - 1].strftime("%m/%d/%Y")

    # ******* Uncoment to write to file ***********
    # with open('play_around.json', 'w') as outfile:
    #     json.dump(data, outfile)

def location_data():
    lat_long_mapping = {}
    final_mapping ={}

    with open('state_location.json') as json_file:
        location = json.load(json_file)
        for key in location:
            lat_long_mapping[location[key]['name']] = {'lat': location[key]['lat'], 'long': location[key]['long'], 'weight': 0}

    start = datetime.datetime.strptime("19-04-2015", "%d-%m-%Y")
    end = datetime.datetime.strptime("12-04-2020", "%d-%m-%Y")
    dates = list(rrule(WEEKLY, dtstart=start, until=end, ))

    pytrends = TrendReq(hl='en-US', tz=360)

    initial_keywords = ['obesity', 'diet', 'exercise', 'disease', 'cancer']

    for item in initial_keywords:
        final_mapping[item] = {}

    i = 0
    while i < len(dates):
        try:
            print('Start: ' + dates[i].strftime("%Y-%m-%d"))
            next_day = dates[i] + timedelta(days=7)
            dates_str = dates[i].strftime("%Y-%m-%d") + " " + next_day.strftime("%Y-%m-%d")
            print(dates_str)
            pytrends.build_payload(kw_list=initial_keywords, geo="US", timeframe=dates_str)
            regional = pytrends.interest_by_region(resolution='REGION', inc_low_vol=True, inc_geo_code=False)

            temp_dict = regional.to_dict('dict')

            date_key = dates[i].strftime("%m/%d/%Y")
            for kw in initial_keywords:
                final_mapping[kw][date_key] = {}
                for key in temp_dict[kw]:
                    if key != 'District of Columbia':
                        to_add = lat_long_mapping[key].copy()
                        to_add['weight'] = temp_dict[kw][key]
                        final_mapping[kw][date_key][key] = to_add
            print('Complete: ' + dates[i].strftime("%Y-%m-%d"))
        except:
            date_key = dates[i].strftime("%m/%d/%Y")
            print("*"*40 + 'FAILED AT: ' + date_key + "*"*40)
            for kw in initial_keywords:
                final_mapping[kw][date_key] = {}
                for key in lat_long_mapping:
                    if key != 'District of Columbia':
                        final_mapping[kw][date_key][key] = lat_long_mapping[key]
            print('Complete: ' + dates[i].strftime("%Y-%m-%d"))
        i += 1

    # with open('test.json', 'w') as outfile:
    #     json.dump(final_mapping, outfile)

def related_table_data():
    final_mapping = {}
    most_recent_nonfail = {}

    start = datetime.datetime.strptime("19-04-2015", "%d-%m-%Y")
    end = datetime.datetime.strptime("12-04-2020", "%d-%m-%Y")
    dates = list(rrule(WEEKLY, dtstart=start, until=end, ))
    pytrends = TrendReq(hl='en-US', tz=360)
    initial_keywords = ['obesity', 'diet', 'exercise', 'disease', 'cancer']

    with open('final_related_data.json') as json_file:
        init_related = json.load(json_file)

        for item in initial_keywords:
            final_mapping[item] = {}
            most_recent_nonfail[item] = list(init_related[item].keys())
    count =0
    for date in dates:
        try:
            print('Starting: ' + date.strftime("%Y-%m-%d"))

            date_key = date.strftime("%m/%d/%Y")
            next_day = date + timedelta(days=7)
            dates_str = date.strftime("%Y-%m-%d") + " " + next_day.strftime("%Y-%m-%d")
            pytrends.build_payload(kw_list=initial_keywords, timeframe=dates_str)
            related = pytrends.related_queries()

            for key in related:
                if type(related[key]['top']) == type(None):
                    print("FAILED " + str(key))
                    final_mapping[key][date_key] = most_recent_nonfail[key]
                else:
                    val = related[key]['top'][:5].to_numpy()
                    val = val[:,0].tolist()
                    final_mapping[key][date_key] = val
                    most_recent_nonfail[key] = val
            print('Complete: ' + date.strftime("%Y-%m-%d"))
        except:
            date_key = date.strftime("%m/%d/%Y")
            print("*"*40 + 'FAILED AT: ' + date_key + "*"*40)
            for key in initial_keywords:
                final_mapping[key][date_key] = most_recent_nonfail[key]
            print('Complete: ' + date.strftime("%Y-%m-%d"))




    print('Done')
    # with open('related_table_data_final1.json', 'w') as outfile:
    #     json.dump(final_mapping, outfile)



# related_table_data()
# location_data()
