from .mongodb_champions import update_mongodb_champion
import time

if __name__ == '__main__':
    while True:
        result = update_mongodb_champion.delay()
        while (not result.result):
            # at this time, our task is not finished, so it will return False
            print('Task finished? ', result.ready())
            print('Task result: ', result.result)
            time.sleep(10)
            # sleep 10 seconds to ensure the task has been finished
            # now the task should be finished and ready method will return True
            print('Task finished? ', result.ready())
            print('Task result: ', result.result)
        time.sleep(21600)
