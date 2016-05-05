from TwitterAPI import TwitterAPI
import json
import boto3

api = TwitterAPI("q2ztTAnPjeDPL9had8Hsyl4SN", "e7iacKmaVC3fusboRUUz8cRY3cLE5mHSckqfbR7ChmkMu2Lb6W", "713496994933776385-EteE0cVnUMgqgX1lnNgmEll1nrXg9Be", "vXh41yILsmCpYqhHN02evFerGnsNkJuVRbOfcpAmosB6k")

r = api.request('statuses/filter', {'track': ['Kobe', 'James', 'Messi', 'Cristiano', 'Curry', 'Trump', 'Clinton', 'Obama', 'Cameron']})

sqs = boto3.resource('sqs')
queue = sqs.get_queue_by_name(QueueName='test')

print(queue.url)
print(queue.attributes.get('DelaySeconds'))

i = 1
for item in r:
    if 'geo' in item and item['geo'] != None and item["lang"] == 'en':
        #es.index(index='twitter', doc_type='people', id=i, body=item)
        #print json.dumps(item, indent = 4)
        queue.send_message(MessageBody=json.dumps(item))
        print json.dumps(item)
        i += 1

