from pymongo import MongoClient
import urllib
import requests
import json
import time

# MONGODB CONNECTION
client = MongoClient("mongodb+srv://henrycwoo:" + urllib.parse.quote(
    "Mongodb52378@") + "@lolproject-hzh6x.gcp.mongodb.net/test?retryWrites=true")

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
        entry = {champion_id: name}
        champion_id_collection.update_one(entry, {'$set': entry}, upsert=True)


if __name__ == "__main__":
    # UPDATE ANY CHANGES TO CHAMPION ID MAPPING
    update_champion_id()

    for key, elo in ELO_MAPPING.items():
        skip = 0
        query_results = get_full_champion_info(INTERVAL_CONSTANT, skip, elo)
        print(elo)

        while (query_results):
            skip += INTERVAL_CONSTANT
            print(skip)

            # ADD ALL RESULTS TO MONGODB
            for champion_data in query_results:
                # ADD ELO TO ID
                champion_data["_id"]["elo"] = champion_data["elo"]
                champion_data["_id"]["patch"] = champion_data["patch"]
                champions_collection.update_one(champion_data["_id"], {'$set': champion_data}, upsert=True)

            time.sleep(1)
            query_results = get_full_champion_info(INTERVAL_CONSTANT, skip, elo)
