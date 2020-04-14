from pytrends.request import TrendReq
import json

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
                print(interest_data)
                data[keyword][subkey] = interest_data
    # kw_list = subkeywords[:5]
    # kw_list2 = subkeywords[5:]

    # data[keyword] = {}


    # pytrends.build_payload(kw_list=kw_list)
    # interest = pytrends.interest_over_time()

    # for subkey in kw_list:
    #     interest_data = [{"date": interest.index[x].strftime("%m/%d/%Y"), "val": int(interest[subkey][x])} for x in range(len(interest))]
    #     data[keyword][subkey] = interest_data

    # if len(kw_list2) > 0:
    #     print(kw_list2)
    #     pytrends.build_payload(kw_list=kw_list2)
    #     interest = pytrends.interest_over_time()

    #     for subkey in kw_list2:
    #         interest_data = [{"date": interest.index[x].strftime("%m/%d/%Y"), "val": int(interest[subkey][x])} for x in range(len(interest))]
    #         data[keyword][subkey] = interest_data

# ******* Uncoment to write to file ***********
with open('play_around.json', 'w') as outfile:
    json.dump(data, outfile)

print("Done")
exit()
