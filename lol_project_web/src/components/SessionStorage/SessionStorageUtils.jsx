export function setSessionItem(key, data) {
  sessionStorage.setItem(key, data);
}

export function getSessionItem(key) {
  return sessionStorage.getItem(key);
}

export const SESSIONKEYS = {
  SINGLE_CHAMPION_AGG_DATA: "single_champion_agg_data",
  RIOT_CHAMPION_DATA: "riot_champion_data",
  CHAMPION_ID: "all_champion_ids",
  PATCH_VERSION: "current_patch_version",
  CHAMPION_NAME_BY_ID: "champion_name_by_id",
  ROLES_OF_CHAMPION: "roles_of_champion"
};
