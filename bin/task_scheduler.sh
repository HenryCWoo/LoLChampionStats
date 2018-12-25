#!/usr/bin/env bash

source venv/bin/activate
redis-server &
rq worker  --path ../redis_task_scheduler &
python ../redis_task_scheduler/redis_task_queueing.py  &
