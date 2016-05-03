from elasticsearch import Elasticsearch
import json

es = Elasticsearch([{'host':'localhost', 'port':9200}])

js1 = es.get(index="twitter", doc_type="people", id=2)

js = json.dumps(js1, ensure_ascii=False, indent = 4)

text = js1["_source"]["text"]
print js