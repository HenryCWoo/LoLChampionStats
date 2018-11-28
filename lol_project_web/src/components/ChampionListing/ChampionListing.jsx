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

import {
  roleMapping,
  stableSort,
  getSorting,
  styles
} from "./ChampionListingConstants";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";

class EnhancedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "desc",
      orderBy: "winRate",
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 25,
      patchVersion: "0"
    };
  }

  generalGetRequest(url, stateVar) {
    fetch(url, {
      method: "GET",
      cache: "no-cache"
    })
      .catch(error => console.log(error))
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ [stateVar]: responseJson });
      });
  }

  componentWillMount() {
    this.generalGetRequest(
      "http://127.0.0.1:5000/champion_data/plat_plus",
      "data"
    );
    this.generalGetRequest("http://127.0.0.1:5000/champion_id", "championId");
    this.generalGetRequest("http://127.0.0.1:5000/patch", "patchVersion");
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    // const emptyRows =
    // rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar patchVersion={this.state.patchVersion} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n._id)}
                      tabIndex={-1}
                      key={n._id}>
                      <TableCell component="th" scope="row">
                        <div className={classes.row}>
                          <Avatar
                            src={require("../../static/images/" +
                              n.championName.replace(/ /g, "") +
                              "/" +
                              n.championName.replace(/ /g, "") +
                              "_square.jpg")}
                            className={classes.avatar}
                          />

                          <div>{n.championName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(n.winRate * 100).toFixed(2) + "%"}
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
                      <TableCell numeric>{n.playRate.toFixed(6)}</TableCell>
                      <TableCell numeric>{n.banRate.toFixed(6)}</TableCell>
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
          count={data.length}
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
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EnhancedTable);
