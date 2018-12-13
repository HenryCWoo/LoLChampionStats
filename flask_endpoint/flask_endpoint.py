import json
import re

from flask import Flask
from flask_restplus import Resource, Api, cors
from pymongo import MongoClient

app = Flask(__name__)
api = Api(app)

# MONGODB CONNECTION
client = MongoClient(
    "mongodb+srv://python_updater:MX8KmZx1oahrPjO3@lolproject-hzh6x.gcp.mongodb.net/test?retryWrites=true")
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


@api.route('/champion_data/<string:elo>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, elo):
        results = list(ELO_COLLECTIONS[elo.lower()].find({}, {"_id": False}))
        insert_champion_name(results)
        return json.dumps(results)


@api.route('/champion_data/<string:elo>/<string:role>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, elo, role):
        results = list(ELO_COLLECTIONS[elo.lower()].find({"role": role.upper()},
                                                         {"_id": False}).limit(10))
        insert_champion_name(results)
        return json.dumps(results)


@api.route('/champion_data/<string:elo>/<string:role>/<int:champion_id>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, elo, role, champion_id):
        results = list(ELO_COLLECTIONS[elo.lower()].find({"role": role.upper(), "championId": champion_id},
                                                         {"_id": False}).limit(10))
        insert_champion_name(results)
        return json.dumps(results)


# ChampionId data

@api.route('/champion_id')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self):
        return json.dumps(list(CHAMPIONID_COLLECTION.find({}, {"_id": False})))


@api.route('/champion_id/<int:champion_id>')
class ChampionData(Resource):
    @cors.crossdomain(origin='*')
    def get(self, champion_id):
        return json.dumps(list(CHAMPIONID_COLLECTION.find_one({"championId": champion_id},
                                                              {"_id": False})))


if __name__ == "__main__":
    app.run(debug=True)
