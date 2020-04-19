from pytrends.request import TrendReq
import json
import datetime
from dateutil.rrule import rrule, WEEKLY
from pprint import pprint

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
    with open('play_around.json', 'w') as outfile:
        json.dump(data, outfile)

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
            dates_str = dates[i].strftime("%Y-%m-%d") + " " + dates[i].strftime("%Y-%m-%d")
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

    with open('all_state_data1.json', 'w') as outfile:
        json.dump(final_mapping, outfile)

def related_table_data():
    final_mapping = {}

    start = datetime.datetime.strptime("19-04-2015", "%d-%m-%Y")
    end = datetime.datetime.strptime("12-04-2020", "%d-%m-%Y")
    dates = list(rrule(WEEKLY, dtstart=start, until=end, ))
    pytrends = TrendReq(hl='en-US', tz=360)
    initial_keywords = ['obesity', 'diet', 'exercise', 'disease', 'cancer']

    for item in initial_keywords:
        final_mapping[item] = {}

    for date in dates:
        print('Starting: ' + date.strftime("%Y-%m-%d"))

        date_key = date.strftime("%m/%d/%Y")
        dates_str = date.strftime("%Y-%m-%d") + " " + date.strftime("%Y-%m-%d")
        pytrends.build_payload(kw_list=initial_keywords, timeframe=dates_str)
        related = pytrends.related_queries()

        for key in related:
            if type(related[key]['top']) == type(None):
                final_mapping[key][date_key] = [None, None, None, None, None]
            else:
                val = related[key]['top'][:5].to_numpy()
                val = val[:,0].tolist()
                final_mapping[key][date_key] = val
        print('Complete: ' + date.strftime("%Y-%m-%d"))

    print('Done')
    with open('related_table_data.json', 'w') as outfile:
        json.dump(final_mapping, outfile)



related_table_data()
# location_data()
