import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Avatar } from "@material-ui/core";
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button";
import { withRouter } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import {
  roleMapping,
  reverseRoleMapping,
  leagueMapping,
  stableSort,
  getSorting,
  styles
} from "./ChampionListingConstants";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar, {
  DEFAULT_LEAGUE,
  DEFAULT_ROLE
} from "./EnhancedTableToolbar";
import {
  getSessionItem,
  setSessionItem,
  SESSIONKEYS
} from "../SessionStorage/SessionStorageUtils";

class ChampionListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "desc",
      orderBy: "winRate",
      data: [],
      filteredData: [],
      selected: [],
      page: 0,
      rowsPerPage: 25,
      patchVersion: "",
      league: DEFAULT_LEAGUE,
      role: DEFAULT_ROLE,
      nameQuery: "",
      fetchInProgress: false
    };

    this.getToolbarParams = this.getToolbarParams.bind(this);
  }

  getToolbarParams(nameQuery, league, role) {
    this.setState({ nameQuery: nameQuery, league: league, role: role });
  }

  changeData(url, ...stateVars) {
    this.setState({ fetchInProgress: true });

    fetch(url, {
      method: "GET",
      cache: "no-cache"
    })
      .catch(error => console.log(error))
      .then(response => response.json())
      .then(responseJson => {
        stateVars.map(stateVar => {
          this.setState({ [stateVar]: responseJson });
        });
        this.setState({ fetchInProgress: false });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state);

    // Perform a request on different league data
    if (this.state.league !== prevState.league) {
      this.setState({ filteredData: [] }, () =>
        this.changeData(
          `http://127.0.0.1:5000/champion_data/${
            leagueMapping[this.state.league]
          }`,
          "data",
          "filteredData"
        )
      );
    }

    // Perform filtering fo changes in role selection or search
    if (
      this.state.role !== prevState.role ||
      this.state.nameQuery !== prevState.nameQuery
    ) {
      if (this.state.role === "All") {
        this.setState({
          filteredData: this.state.data.filter(data =>
            data["championName"]
              .toLowerCase()
              .includes(this.state.nameQuery.toLowerCase().trim())
          )
        });
      } else {
        this.setState({
          filteredData: this.state.data
            .filter(
              data => data["role"] === reverseRoleMapping[this.state.role]
            )
            .filter(data =>
              data["championName"]
                .toLowerCase()
                .includes(this.state.nameQuery.toLowerCase().trim())
            )
        });
      }
    }
  }

  componentDidMount() {
    this.changeData(
      `http://127.0.0.1:5000/champion_data/${leagueMapping[this.state.league]}`,
      "data",
      "filteredData"
    );
    this.generalGetRequest(
      "http://127.0.0.1:5000/champion_id",
      "championId",
      SESSIONKEYS.CHAMPION_ID
    );
    this.generalGetRequest(
      "http://127.0.0.1:5000/patch",
      "patchVersion",
      SESSIONKEYS.PATCH_VERSION
    );
  }

  generalGetRequest(url, stateVar, sessionVar) {
    let sessionData = getSessionItem(sessionVar);
    if (sessionData) {
      this.setState({ [stateVar]: JSON.parse(sessionData) });
      return;
    }
    fetch(url, {
      method: "GET",
      cache: "no-cache"
    })
      .catch(error => console.log(error))
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ [stateVar]: responseJson });
        setSessionItem(sessionVar, JSON.stringify(responseJson));
      });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleClick = (event, champion) => {
    this.props.history.push(
      "/champion/" +
        this.state.league +
        "/" +
        champion["championName"] +
        "/" +
        roleMapping[champion["role"]]
    );
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  winRateBarChart(n) {
    let data = [{ name: "data", winRate: n.winRate }];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center"
        }}>
        <div
          style={{
            transform: "rotate(90deg)",
            justifySelf: "center"
          }}>
          <BarChart
            width={50}
            height={20}
            data={data}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            {/* <XAxis type="number" />
          <YAxis type="category" /> */}
            <Bar dataKey="winRate" fill="#8884d8" />
          </BarChart>
        </div>

        <div>{(n.winRate * 100).toFixed(2) + "%"}</div>
      </div>
    );
  }

  renderAvatar(championName) {
    const { classes } = this.props;
    if (championName)
      return (
        <Avatar
          src={require("../../static/images/" +
            championName.replace(/\s/g, "") +
            "/" +
            championName.replace(/\s/g, "") +
            "_square.jpg")}
          className={classes.avatar}
        />
      );
  }

  // Will only display if state.fetchInProgress is true
  displayLoading() {
    const { classes } = this.props;
    const { filteredData, order, orderBy, rowsPerPage, page } = this.state;

    if (this.state.fetchInProgress) {
      return (
        <div>
          <img
            src={require("../../static/loading_blob.gif")}
            style={{ filter: "brightness(0.6)" }}
            className={classes.loadingBlob}
          />
        </div>
      );
    } else {
      return (
        <div>
          <ScrollUpButton style={{ width: 30, height: 30 }} />
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                rowCount={filteredData.length}
              />
              <TableBody>
                {stableSort(filteredData, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((n, index) => {
                    return (
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, n)}
                        tabIndex={-1}
                        key={index + "championTableRow"}>
                        <TableCell padding="checkbox">
                          {index + 1 + page * rowsPerPage}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className={classes.row}>
                            {this.renderAvatar(n.championName)}
                            <div>{n.championName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>{this.winRateBarChart(n)}</div>
                        </TableCell>
                        <TableCell>{roleMapping[n.role]}</TableCell>
                        <TableCell numeric>{n.gamesPlayed}</TableCell>
                        <TableCell numeric>
                          {n.minionsKilled.toFixed(2)}
                        </TableCell>
                        <TableCell numeric>{n.goldEarned.toFixed(2)}</TableCell>
                        <TableCell numeric>{n.kills.toFixed(2)}</TableCell>
                        <TableCell numeric>{n.deaths.toFixed(2)}</TableCell>
                        <TableCell numeric>{n.assists.toFixed(2)}</TableCell>
                        <TableCell numeric>
                          {(n.playRate * 100).toFixed(3) + "%"}
                        </TableCell>
                        <TableCell numeric>
                          {(n.banRate * 100).toFixed(3) + "%"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {/* {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </div>
      );
    }
  }

  render() {
    const { classes } = this.props;
    const { filteredData, order, orderBy, rowsPerPage, page } = this.state;
    // const emptyRows =
    // rowsPerPage - Math.min(rowsPerPage, filteredData.length - page * rowsPerPage);

    return (
      <div style={{ paddingBottom: 24 }}>
        <Paper className={classes.root}>
          <EnhancedTableToolbar
            patchVersion={this.state.patchVersion}
            getToolbarParams={this.getToolbarParams}
          />
          {this.displayLoading()}
        </Paper>
      </div>
    );
  }
}

ChampionListing.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(ChampionListing));
