import os
from urllib.request import urlretrieve

import requests
from pymongo import MongoClient

# MONGODB CONNECTION
client = MongoClient(
    "mongodb+srv://python_updater:MX8KmZx1oahrPjO3@lolproject-hzh6x.gcp.mongodb.net/test?retryWrites=true")
db = client["lol_statistics"]

IMAGE_RESOURCE_DESTINATION = "../lol_project_web/src/static"


def update_champion_resource_file(version, champion):
    splashUrl = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + champion + "_0.jpg"
    loadingUrl = "http://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + champion + "_0.jpg"
    squareUrl = "http://ddragon.leagueoflegends.com/cdn/" + version + "/img/champion/" + champion + ".png"
    destination = IMAGE_RESOURCE_DESTINATION + "/images/" + champion + "/"
    if not os.path.exists(destination):
        os.makedirs(destination)

    urlretrieve(splashUrl, destination + champion + '_splash.jpg')
    urlretrieve(loadingUrl, destination + champion + '_loading.jpg')
    urlretrieve(squareUrl, destination + champion + '_square.jpg')
    print("RESOURCES RECEIVED FOR: " + champion)


def update_champion_image_resources():
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
        # Download image resource files for the champion
        update_champion_resource_file(version, name)


def update_item_image_resources():
    REALM_ENDPOINT = "https://ddragon.leagueoflegends.com/realms/na.json"

    response = requests.get(REALM_ENDPOINT).json()
    version = response['n']['item']

    ITEM_ENDPOINT = requests.get("http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/item.json").json()
    item_ids = list(ITEM_ENDPOINT["data"].keys())

    destination = IMAGE_RESOURCE_DESTINATION + "/items/"
    if not os.path.exists(destination):
        os.makedirs(destination)
    for item_id in item_ids:
        urlretrieve("http://ddragon.leagueoflegends.com/cdn/" + version + "/img/item/" + item_id + ".png ",
                    destination + item_id + ".png")
        print("Retrieved item:", item_id)


def update_summoners_image_resources():
    REALM_ENDPOINT = "https://ddragon.leagueoflegends.com/realms/na.json"

    response = requests.get(REALM_ENDPOINT).json()
    version = response['n']['mastery']

    SUMMONER_ENDPOINT = requests.get(
        "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/summoner.json").json()
    mastery_ids = list(SUMMONER_ENDPOINT["data"].keys())

    destination = IMAGE_RESOURCE_DESTINATION + "/summoners/"
    if not os.path.exists(destination):
        os.makedirs(destination)
    for mastery_id in mastery_ids:
        urlretrieve("http://ddragon.leagueoflegends.com/cdn/" + version + "/img/spell/" + mastery_id + ".png ",
                    destination + mastery_id + ".png")
        print("Retrieved item:", mastery_id)


if __name__ == "__main__":
    # update_champion_image_resources()
    # update_item_image_resources()
    update_summoners_image_resources()
