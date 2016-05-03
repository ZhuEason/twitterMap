import boto3
import json
from alchemyapi import AlchemyAPI

sqs = boto3.resource('sqs')
queue = sqs.get_queue_by_name(QueueName='test')
alchemyapi = AlchemyAPI()

while (True):
    for message in queue.receive_messages(MessageAttributeNames=['.*'], MaxNumberOfMessages=10, VisibilityTimeout=123, WaitTimeSeconds=20):
    #print json.loads(message.body), indent = 4)
        js = json.loads(message.body)
    #message.delete()
        response = alchemyapi.sentiment("text", js['text'])
        print "Sentiment: ", response["docSentiment"]["type"]

'''
for message in queue.receive_messages(MessageAttributeNames=['Author']):
    # Get the custom author message attribute if it was set
    author_text = ''
    if message.message_attributes is not None:
        author_name = message.message_attributes.get('Author').get('StringValue')
        if author_name:
            author_text = ' ({0})'.format(author_name)

    # Print out the body and author (if set)
    print('Hello, {0}!{1}'.format(message.body, author_text))

    # Let the queue know that the message is processed
    #message.delete()
'''