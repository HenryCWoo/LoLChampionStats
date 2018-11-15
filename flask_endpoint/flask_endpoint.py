import urllib

from flask import Flask
from flask_restplus import Resource, Api
from pymongo import MongoClient

app = Flask(__name__)
api = Api(app)

# MONGODB CONNECTION
client = MongoClient("mongodb+srv://flask_server:" + urllib.parse.quote(
    "B5qjOZ5HcatZbVx0") + "@lolproject-hzh6x.gcp.mongodb.net/test?retryWrites=true")

db = client["lol_statistics"]

champions_collection = db.champions
champion_id_collection = db.champion_id


@api.route('/champion_data/<string:elo>/<string:role>/<int:champion_id>')
class ChampionData(Resource):
    def get(self, elo, role, champion_id):
        return list(champions_collection.find({"elo": elo, "role": role, "championId": champion_id},
                                               {"_id": False}))

@api.route('/champion_id/<int:champion_id>')
class ChampionData(Resource):
    def get(self, champion_id):
        return (champion_id_collection.find_one({"championId": champion_id},
                                               {"_id": False}))


if __name__ == "__main__":
    app.run(debug=True)
