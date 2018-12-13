from mongodb_champions import update_aggs, update_resources_and_static_data
from redis import Redis
from rq import Queue

if __name__ == "__main__":
    q = Queue(connection=Redis())
    q.enqueue(update_aggs)
    q.enqueue(update_resources_and_static_data)
