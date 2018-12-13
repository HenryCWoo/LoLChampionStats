import json
import re

from bson.json_util import dumps
from flask import Flask
from flask_restplus import Resource, Api, cors
from pymongo import MongoClient

app = Flask(__name__)
api = Api(app)

# MONGODB CONNECTION
client = MongoClient(
    "mongodb+srv://flask_server:x8a1PGutyHAjwyTn@lolproject-hzh6x.gcp.mongodb.net/test?retryWrites=true")
db = client["lol_statistics"]

CHAMPIONID_COLLECTION = db.champion_id

ELO_COLLECTIONS = {
    "bronze": db.bronze_agg,
    "silver": db.silver_agg,
    "gold": db.gold_agg,
    "platinum": db.platinum_agg,
    "plat_plus": db.plat_plus_agg
}


def insert_champion_name(results):
    for champion in results:
        championName = CHAMPIONID_COLLECTION.find_one({"championId": champion["championId"]},
                                                      {"_id": False})["name"]
        champion["championName"] = re.sub(r"(\w)([A-Z])", r"\1 \2", championName)
        champion["originalChampionName"] = championName


def convert_id_to_string(results):
    for champion in results:
        champion["_id"] = str(champion["_id"])



@api.route('/champion_data/<string:elo>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, elo):
        results = list(ELO_COLLECTIONS[elo.lower()].find({}))
        insert_champion_name(results)
        convert_id_to_string(results)
        return json.dumps(results)


@api.route('/champion_data/<string:elo>/<string:role>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, elo, role):
        results = list(ELO_COLLECTIONS[elo.lower()].find({"role": role.upper()}))
        insert_champion_name(results)
        convert_id_to_string(results)
        return json.dumps(results)


@api.route('/champion_data/<string:elo>/<string:role>/<string:championName>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, elo, role, championName):
        results = list(ELO_COLLECTIONS[elo.lower()].find(
            {"role": role.upper(), "championName": re.sub(r"(\w)([A-Z])", r"\1 \2", championName)}))
        insert_champion_name(results)
        convert_id_to_string(results)
        return json.dumps(results)


@api.route('/champion_roles/<string:elo>/<string:championName>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, elo, championName):
        championId = CHAMPIONID_COLLECTION.find_one({"name": championName})["championId"]
        results = list(ELO_COLLECTIONS[elo.lower()].find(
            {"championId": championId}, {"role": 1, "_id": 0}))
        return json.dumps(results)


# Individual Champion Data

@api.route('/single_champion/<string:elo>/<string:championName>/<string:role>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, elo, championName, role):
        championName = CHAMPIONID_COLLECTION.find_one({"name": championName})
        championId = championName["championId"]
        results = dict(ELO_COLLECTIONS[elo.lower()].find_one(
            {"championId": championId, "role": role}))
        results["championName"] = championName
        return dumps(results)


# ChampionId data

@api.route('/champion_id')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self):
        results = list(CHAMPIONID_COLLECTION.find({}))
        convert_id_to_string(results)
        return json.dumps(results)



@api.route('/champion_id/<int:champion_id>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, champion_id):
        results = CHAMPIONID_COLLECTION.find_one({"championId": champion_id}, {"name": 1, "_id": False})
        return dumps(results)


@api.route('/champion_by_id/<int:champion_id>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, champion_id):
        results = db["champion_info"].find_one({"key": champion_id})
        results["_id"] = str(results["_id"])
        return json.dumps(results)


@api.route('/champion_by_name/<string:name>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, name):
        results = db["champion_info"].find_one({"id": name})
        results["_id"] = str(results["_id"])
        return json.dumps(results)


# Get Metadata
@api.route('/patch')
class MetaData(Resource):
    @cors.crossdomain(origin='*')
    def get(self):
        results = db.metadata.find_one({"_id": "plat_plus_agg_version"})["patch"]
        return json.dumps(results)


if __name__ == "__main__":
    app.run(debug=True)
