from pymongo import MongoClient
import urllib
import requests
import time

from celery_task_scheduler.celery import app

# MONGODB CONNECTION
client = MongoClient("mongodb+srv://python_updater:" + urllib.parse.quote(
    "MX8KmZx1oahrPjO3") + "@lolproject-hzh6x.gcp.mongodb.net/test?retryWrites=true")

db = client["lol_statistics"]

champions_collection = db.champions
champion_id_collection = db.champion_id

# API CALL TO CHAMPION.GG FOR AGGREGATE STATISTICS
INTERVAL_CONSTANT = 30

ELO_MAPPING = {
    1: "BRONZE",
    2: "SILVER",
    3: "GOLD",
    4: "PLATINUM",
    5: ""
}

# GET FULL INFO OF CHAMPION FROM CHAMPION.GG
def get_full_champion_info(limit, skip, elo):
    url = "http://api.champion.gg/v2/champions"

    querystring = {"sort": "championId-asc", "limit": str(limit), "skip": str(skip), "elo": elo,
                   "champData": "kda,damage,minions,wins,wards,positions,normalized,averageGames,overallPerformanceScore,goldEarned,sprees,hashes,wins,maxMins,matchups",
                   "api_key": "9a2cca9a89bbf20968fc204de5ff60b1"}
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "45d34650-3276-4c01-bb73-7c35ed5d4c1f"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    return response.json()


# GET MOST UPDATED CHAMPION ID MAPPING
def update_champion_id():
    REALM_ENDPOINT = "https://ddragon.leagueoflegends.com/realms/na.json"

    response = requests.get(REALM_ENDPOINT).json()
    version = response["v"]

    url = "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/championFull.json"
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "297ce64a-5e66-4e80-9c0d-8f32d3f75596"
    }
    response = requests.request("GET", url, headers=headers)
    champion_ids = response.json()["keys"]
    for champion_id, name in champion_ids.items():
        entry = {"championId": int(champion_id), "name": name}
        champion_id_collection.update_one(entry, {'$set': entry}, upsert=True)


##############################################
#               MONGODB UPDATES              #
##############################################
@app.task
def update_mongodb_champion():
    # UPDATE ANY CHANGES TO CHAMPION ID MAPPING
    update_champion_id()

    for key, elo in ELO_MAPPING.items():
        skip = 0

        # BATCH QUERIES
        query_results = get_full_champion_info(INTERVAL_CONSTANT, skip, elo)
        print("CURRENT ELO (IF BLANK, IT IS PLATINUM+): ", elo)

        while (query_results):
            skip += INTERVAL_CONSTANT
            print("Number of results received: ", len(query_results))

            # ADD ALL RESULTS TO MONGODB
            for champion_data in query_results:
                # ADD ELO TO ID
                del champion_data["_id"]
                champions_collection.update_one({"championId": champion_data["championId"],
                                                 "patch": champion_data["patch"],
                                                 "elo": champion_data["elo"],
                                                 "role": champion_data["role"]}, {'$set': champion_data}, upsert=True)

            # SLOW DOWN QUERIES
            time.sleep(1)
            query_results = get_full_champion_info(INTERVAL_CONSTANT, skip, elo)
