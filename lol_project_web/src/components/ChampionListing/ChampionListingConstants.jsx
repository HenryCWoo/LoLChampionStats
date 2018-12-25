export const roleMapping = {
  DUO_CARRY: "ADC",
  DUO_SUPPORT: "Support",
  JUNGLE: "Jungle",
  MIDDLE: "Middle",
  TOP: "Top"
};

export const reverseRoleMapping = {
  ADC: "DUO_CARRY",
  Support: "DUO_SUPPORT",
  Jungle: "JUNGLE",
  Middle: "MIDDLE",
  Top: "TOP"
};

export const leagueMapping = {
  Bronze: "bronze",
  Silver: "silver",
  Gold: "gold",
  Platinum: "platinum",
  "Platinum+": "plat_plus"
};

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

export const styles = theme => ({
  root: {
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 800
  },
  tableWrapper: {
    overflowX: "auto"
  },
  row: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 49
  },
  avatar: {
    marginRight: 10
  },
  loadingBlob: {
    width: 128,
    height: 128,
    display: "block",
    marginTop: 300,
    paddingBottom: 300,
    marginLeft: "auto",
    marginRight: "auto"
  }
});
