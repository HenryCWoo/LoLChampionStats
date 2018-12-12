from .mongodb_champions import update_mongodb
from redis import Redis
from rq import Queue

q = Queue(connection=Redis())
job = q.enqueue(update_mongodb)
