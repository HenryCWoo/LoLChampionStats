import requests
from pymongo import MongoClient

# MONGODB CONNECTION
client = MongoClient(
    "mongodb+srv://python_updater:MX8KmZx1oahrPjO3@lolproject-hzh6x.gcp.mongodb.net/test?retryWrites=true")
db = client["lol_statistics"]

# GET MONGODB COLLECTIONS BY NAME
METADATA_COLLECTION = db["metadata"]

# ENDPOINT FOR DOWNLOADING VERSION NUMBERS
REALM_ENDPOINT = "https://ddragon.leagueoflegends.com/realms/na.json"

ELO_MAPPING = {
    1: "BRONZE",
    2: "SILVER",
    3: "GOLD",
    4: "PLATINUM",
    5: ""  # Empty string is PLATINUM+ elo
}


def get_riot_static_api_versions():
    """
    Get most updated versions from Riot's API
    *NOTE: Successful return values will include "_id" field used by mongoDB

    :return: API versions of static data from Riot API, else None
    """
    try:
        response = requests.get(REALM_ENDPOINT).json()
        response["_id"] = "riot_static_api_versions"
        return response
    except:
        return None


def get_mongodb_riot_static_api_versions():
    """
    Get most updated versions of Riot's static api from mongoDB

    :return: None if no metadata was found, else return the current metadata from mongoDB
    """
    riot_static_api_versions = METADATA_COLLECTION.find_one({"_id": "riot_static_api_versions"})
    return riot_static_api_versions


def update_riot_static_api_versions():
    """
    Perform updates to metadata if necessary

    :return: True if mongoDB metadata was updated, else False
    """
    mongodb_static_versions = get_mongodb_riot_static_api_versions()
    most_recent_static_data = get_riot_static_api_versions()

    print("VERSIONS IN MONGODB: ", mongodb_static_versions)
    print("VERSIONS OF RIOT API", most_recent_static_data)

    # If riot api versions are not found, insert a new one
    # If riot api versions are outdated, update the existing one
    if mongodb_static_versions != most_recent_static_data:
        METADATA_COLLECTION.update_one({"_id": "riot_static_api_versions"}, {'$set': most_recent_static_data},
                                       upsert=True)
        return True
    return False


#################################################################################

def get_championgg_elo_agg_versions():
    """
    Get most recent aggregated statistics versions from Champion.gg API

    :return: Dictionary of elo indices (according to #ELO_MAPPING) to versions
    """
    elo_versions = {}

    url = "http://api.champion.gg/v2/general"
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "70d2d11b-2e2c-41ef-8567-229dfddd3f4c"
    }

    for index, elo in ELO_MAPPING.items():
        querystring = {"elo": elo, "api_key": "9a2cca9a89bbf20968fc204de5ff60b1"}
        response = requests.request("GET", url, headers=headers, params=querystring)
        response = response.json()[0]  # indexed at zero to only consider most recent version
        if elo == "":
            response["_id"] = "plat_plus_agg_version"
        else:
            response["_id"] = elo.lower() + "_agg_version"

        elo_versions[index] = response

    return elo_versions


def get_mongodb_elo_agg_versions():
    """
    Get most updated versions of aggregated statistics from mongoDB

    :return: Dictionary of elo indices (according to #ELO_MAPPING) to versions
    """
    elo_versions = {}
    for index, elo in ELO_MAPPING.items():
        if elo == "":
            elo_versions[index] = METADATA_COLLECTION.find_one({"_id": "plat_plus_agg_version"})
        else:
            elo_versions[index] = METADATA_COLLECTION.find_one({"_id": elo.lower() + "_agg_version"})
    return elo_versions


def update_elo_agg_versions():
    """
    Update Aggregate data by elo from Champion.gg API if it doesn't exist or is outdated

    :return: List of indices in the #ELO_MAPPING
                (ie. [1,3,4])
    """
    mongodb_elo_agg_versions = get_mongodb_elo_agg_versions()
    most_recent_elo_agg_versions = get_championgg_elo_agg_versions()

    updated_indices = []
    for index, elo in ELO_MAPPING.items():
        if mongodb_elo_agg_versions[index] != most_recent_elo_agg_versions[index]:
            if elo == "":
                METADATA_COLLECTION.update_one({"_id": "plat_plus_agg_version"},
                                               {'$set': most_recent_elo_agg_versions[index]},
                                               upsert=True)
                updated_indices.append(index)
            else:
                METADATA_COLLECTION.update_one({"_id": elo.lower() + "_agg_version"},
                                               {'$set': most_recent_elo_agg_versions[index]},
                                               upsert=True)
                updated_indices.append(index)
    return updated_indices

# if __name__ == "__main__":
#     print(update_riot_static_api_versions())
#     print(update_elo_agg_versions())
