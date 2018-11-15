#!/usr/bin/env bash

echo "IF 'NUMBER OF RESULTS RECEIVED' IS PRINTED, IGNORE ANY ERROR MESSAGES."
echo "THOSE ARE DUE TO THE SERVERS SPINNING UP OUT OF ORDER"

source venv/bin/activate
rabbitmq-server &
celery -A celery_task_scheduler worker --loglevel=info &
python -m celery_task_scheduler.run_tasks &
