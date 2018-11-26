from pymongo import MongoClient
import requests

# MONGODB CONNECTION
client = MongoClient("mongodb+srv://python_updater:MX8KmZx1oahrPjO3@lolproject-hzh6x.gcp.mongodb.net/test?retryWrites=true")
db = client["lol_statistics"]


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
