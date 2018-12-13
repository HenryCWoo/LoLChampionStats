import os
from urllib.request import urlretrieve

import requests
from pymongo import MongoClient

# MONGODB CONNECTION
client = MongoClient(
    "mongodb+srv://python_updater:MX8KmZx1oahrPjO3@lolproject-hzh6x.gcp.mongodb.net/test?retryWrites=true")
db = client["lol_statistics"]

CHAMPION_RESOURCE_DESTINATION = "../lol_project_web/src/static"


# GET MOST UPDATED CHAMPION ID MAPPING
def update_champion_id():
    # GET MONGODB COLLECTION NAMES
    champion_id_collection = db["champion_id"]

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


def update_champion_info():
    champion_info_collection = db["champion_info"]

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
        print("Getting individual champion info for:", name)
        champion_info_endpoint = "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/champion/" + name + ".json"
        champion_info_response = requests.get(champion_info_endpoint).json()
        entry = champion_info_response["data"][name]
        entry["key"] = int(entry["key"])
        entry["_id"] = champion_id
        champion_info_collection.update_one(entry, {'$set': entry}, upsert=True)



# if __name__ == "__main__":
    # update_champion_id()
    # update_champion_info()