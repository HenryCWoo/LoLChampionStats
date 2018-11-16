from .mongodb_champions import update_mongodb_champion
import time

if __name__ == '__main__':
    # TASK SHOULD ONLY BE RUN AFTER MESSAGE BROKER AND TASK SCHEDULER ARE ONLINE
    start = time.time()
    while True:
        result = update_mongodb_champion.delay()
        while (not result.result):
            print("UPTIME: ", time.time() - start)
            time.sleep(10)

        time.sleep(21600)
