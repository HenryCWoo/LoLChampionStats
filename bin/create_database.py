import requests
import pymysql

STATS_TABLE = "statistics"
ELO_TABLE = "elo"
ROLE_TABLE = "role"
CHAMPION_TABLE = "champion"

LOL_GOOGLE_CLOUD_DB = pymysql.connect(
    host="35.193.50.52",
    user="python-script",
    passwd="SK39AmKvpn8fPuw",
    database="lol_statistics"
)

ELO_MAPPING = {
    1: "BRONZE",
    2: "SILVER",
    3: "GOLD",
    4: "PLATINUM",
    5: "PLATINUM,DIAMOND,MASTER,CHALLENGER"
}

ROLE_MAPPING = {
    1: "TOP",
    2: "JUNGLE",
    3: "MIDDLE",
    4: "SYNERGY",
    5: "ADCSUPPORT",
    6: "DUO_CARRY"
}

REALM_ENDPOINT = "https://ddragon.leagueoflegends.com/realms/na.json"


def get_most_recent_version():
    response = requests.get(REALM_ENDPOINT).json()
    return response["v"]


def get_champions_full(version):
    url = "http://ddragon.leagueoflegends.com/cdn/" + version + "/data/en_US/championFull.json"
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "297ce64a-5e66-4e80-9c0d-8f32d3f75596"
    }
    response = requests.request("GET", url, headers=headers)

    return response.json()


def update_add_champs(champ_keys):
    if not champ_keys:
        return

    cursor = LOL_GOOGLE_CLOUD_DB.cursor()
    cursor.execute(
        "CREATE TABLE IF NOT EXISTS " + CHAMPION_TABLE + " ( id INTEGER NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id) );")

    for id, name in champ_keys.items():
        cursor.execute(
            "INSERT INTO " + CHAMPION_TABLE + " VALUES(" + id + ", \"" + name + "\") ON DUPLICATE KEY UPDATE id = " + id + ", name = \"" + name + "\";")


if __name__ == "__main__":
    cursor = LOL_GOOGLE_CLOUD_DB.cursor()

    version = get_most_recent_version()
    full_champion_details = get_champions_full(version)
    champ_keys = full_champion_details["keys"]
    update_add_champs(champ_keys)

    cursor.execute(
        "CREATE TABLE IF NOT EXISTS " + ELO_TABLE +
        " ( id INTEGER NOT NULL,"
        " name VARCHAR(255) NOT NULL,"
        " PRIMARY KEY (id));")
    for key, value in ELO_MAPPING.items():
        cursor.execute(
            "INSERT INTO " + ELO_TABLE + " VALUES(" + str(
                key) + ", \"" + value + "\") ON DUPLICATE KEY UPDATE id = " + str(key) + ", name = \"" + value + "\";")

    cursor.execute(
        "CREATE TABLE IF NOT EXISTS " + ROLE_TABLE +
        " ( id INTEGER NOT NULL,"
        " name VARCHAR(255) NOT NULL,"
        " PRIMARY KEY (id));")
    for key, value in ROLE_MAPPING.items():
        cursor.execute(
            "INSERT INTO " + ROLE_TABLE + " VALUES(" + str(
                key) + ", \"" + value + "\") ON DUPLICATE KEY UPDATE id = " + str(key) + ", name = \"" + value + "\";")

    cursor.execute(
        "CREATE TABLE IF NOT EXISTS " + STATS_TABLE +
        " ( id INTEGER NOT NULL AUTO_INCREMENT,"
        " elo_id INTEGER NOT NULL,"
        " patch VARCHAR(16) NOT NULL,"
        " champion_id INTEGER NOT NULL,"
        " role_id INTEGER NOT NULL,"
        " win_rate FLOAT(8,8),"
        " kills FLOAT(20,16),"
        " total_damage_taken FLOAT(24,8),"
        " wards_killed FLOAT(24,16),"
        " average_games FLOAT(24,16),"
        " neutral_minions_killed_team_jungle FLOAT(20,16),"
        " assists FLOAT(20,8),"
        " play_rate FLOAT(8,8),"
        " games_played BIGINT,"
        " overall_performance_score FLOAT(20,8),"
        " percent_role_played FLOAT(16,16),"
        " neutral_minions_killed_enemy_jungle FLOAT(20,8),"
        " gold_earned FLOAT(24,8),"
        " killing_sprees FLOAT(16,8),"
        " deaths FLOAT(16,8),"
        " ward_placed FLOAT(16,8),"
        " ban_rate FLOAT(8,8),"
        " minions_killed FLOAT(16,8),"
        " total_heal FLOAT(16,8),"
        " PRIMARY KEY (id),"
        " FOREIGN KEY (elo_id) REFERENCES " + ELO_TABLE + "(id),"
        " FOREIGN KEY (role_id) REFERENCES " + ROLE_TABLE + "(id),"
        " FOREIGN KEY (champion_id) REFERENCES " + CHAMPION_TABLE + "(id));")

    cursor.close()
    LOL_GOOGLE_CLOUD_DB.commit()
    LOL_GOOGLE_CLOUD_DB.close()
