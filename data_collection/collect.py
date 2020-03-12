from pytrends.request import TrendReq

pytrends = TrendReq(hl='en-US', tz=360)

initial_keywords = ['obesity', 'diet', 'exercise', 'disease', 'cancer']
keywords = {}
pytrends.build_payload(kw_list=initial_keywords)

related = pytrends.related_queries()
related_data = [related[x]['top'][:1].to_numpy() for x in related]
related_terms = [x[:,0] for x in related_data]

for x in range(len(initial_keywords)):
    keywords[initial_keywords[x]] = related_terms[x].tolist()

for x in keywords.copy():
    subkeywords = keywords[x]
    pytrends.build_payload(kw_list=subkeywords)
    related = pytrends.related_queries()
    related_data = [related[x]['top'][:1].to_numpy() for x in related]
    related_terms = [x[:,0] for x in related_data]
    for i in range(len(subkeywords)):
        keywords[x].extend(related_terms[i].tolist())

data = {}

for keyword in keywords:
    subkeywords = keywords[keyword]

    kw_list = subkeywords[:5]
    kw_list2 = subkeywords[5:]

    data[keyword] = {}


    pytrends.build_payload(kw_list=kw_list)
    interest = pytrends.interest_over_time()

    for subkey in kw_list:
        interest_data = [{"date": interest.index[x].strftime("%m/%d/%Y"), "val": interest[subkey][x]} for x in range(len(interest))]
        data[keyword][subkey] = interest_data

    if len(kw_list2) > 0:
        pytrends.build_payload(kw_list=kw_list2)
        interest = pytrends.interest_over_time()

        for subkey in kw_list2:
            interest_data = [{"date": interest.index[x].strftime("%m/%d/%Y"), "val": interest[subkey][x]} for x in range(len(interest))]
            data[keyword][subkey] = interest_data

print(data)
exit()
