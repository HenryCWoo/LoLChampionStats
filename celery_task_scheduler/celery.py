from celery import Celery


# CONFIGURE CELERY TASK SCHEDULER
app = Celery('celery_task_scheduler',
             broker='amqp://henrycwoo:rabbitmq_password@localhost/henrycwoo_vhost',
             backend='rpc://',
             include=['celery_task_scheduler.mongodb_champions'])