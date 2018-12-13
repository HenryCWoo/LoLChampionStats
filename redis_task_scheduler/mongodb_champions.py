import time

from rq.decorators import job
from update_champion_id import *
from update_image_resources import *
from update_metadata import *

# MONGODB CONNECTION
client = MongoClient(
    "mongodb+srv://python_updater:MX8KmZx1oahrPjO3@lolproject-hzh6x.gcp.mongodb.net/test?retryWrites=true")
db = client["lol_statistics"]

# API CALL TO CHAMPION.GG FOR AGGREGATE STATISTICS
INTERVAL_CONSTANT = 30

ELO_MAPPING = {
    1: "BRONZE",
    2: "SILVER",
    3: "GOLD",
    4: "PLATINUM",
    5: ""  # Empty string is PLATINUM+ elo
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


##############################################
#               MONGODB UPDATES              #
##############################################
@job('high', timeout=180)
def update_aggs():
    # UPDATE METADATA
    elo_agg_indices_updated = update_elo_agg_versions()

    print(elo_agg_indices_updated)

    # UPDATE ANY CHANGES TO CHAMPION STATISTICS
    if elo_agg_indices_updated:
        for index in elo_agg_indices_updated:
            elo = ELO_MAPPING[index]

            if elo == "":
                elo_name = "plat_plus"
            else:
                elo_name = elo.lower()

            production_collection_name = elo_name + "_agg"
            production_collection = db[production_collection_name]
            temporary_collection_name = elo_name + "_temp"
            temporary_collection = db[temporary_collection_name]
            temporary_collection.drop()

            # BATCH QUERIES
            skip = 0
            query_results = get_full_champion_info(INTERVAL_CONSTANT, skip, elo)
            print("CURRENT COLLECTION TO BE UPDATED: ", production_collection_name)

            while (query_results):
                skip += INTERVAL_CONSTANT
                print("Number of results received: ", len(query_results))

                # ADD ALL RESULTS TO MONGODB
                for champion_data in query_results:
                    # ADD ELO TO ID
                    del champion_data["_id"]
                    # TODO: PRECOMPUTE CHAMPION NAMES HERE
                    temporary_collection.update_one({"championId": champion_data["championId"],
                                                     "patch": champion_data["patch"],
                                                     "elo": champion_data["elo"],
                                                     "role": champion_data["role"]}, {'$set': champion_data},
                                                    upsert=True)

                # SLOW DOWN QUERIES
                time.sleep(1)

                query_results = get_full_champion_info(INTERVAL_CONSTANT, skip, elo)

            # Remove old data and replace with new
            production_collection.drop()
            temporary_collection.rename(production_collection_name)
            print("SUCCESSFULLY UPDATED", production_collection_name)


@job('high', timeout=180)
def update_resources_and_static_data():
    riot_static_api_versions_updated = update_riot_static_api_versions()
    print(riot_static_api_versions_updated)
    # UPDATE CHAMPION ID DATA
    if riot_static_api_versions_updated:
        update_champion_id()
        update_champion_info()
        update_champion_image_resources()
        update_item_image_resources()
        update_summoners_image_resources()
# if __name__ == "__main__":
#     update_mongodb()
