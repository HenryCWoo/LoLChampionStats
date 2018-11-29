import React, { Component } from "react";
import PropTypes from "prop-types";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";

const rows = [
  {
    id: "championName",
    numeric: false,
    disablePadding: false,
    label: "Champion"
  },
  { id: "winRate", numeric: false, disablePadding: false, label: "Win Rate" },
  { id: "role", numeric: false, disablePadding: false, label: "Role" },
  { id: "gamesPlayed", numeric: true, disablePadding: false, label: "Games" },
  {
    id: "minionsKilled",
    numeric: true,
    disablePadding: false,
    label: "CS"
  },
  { id: "goldEarned", numeric: true, disablePadding: false, label: "Gold" },
  { id: "kills", numeric: true, disablePadding: false, label: "Kills" },
  { id: "deaths", numeric: true, disablePadding: false, label: "Deaths" },
  { id: "assists", numeric: true, disablePadding: false, label: "Assists" },
  { id: "playRate", numeric: true, disablePadding: false, label: "Play Rate" },
  { id: "banRate", numeric: true, disablePadding: false, label: "Ban Rate" }
];

class EnhancedTableHead extends Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell
            key={"rank"}
            numeric={false}
            padding="checkbox"
            sortDirection={false}>
            <Tooltip title="Ranking" placement="bottom-start" enterDelay={300}>
              <TableSortLabel>{"#"}</TableSortLabel>
            </Tooltip>
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}>
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}>
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}>
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

export default EnhancedTableHead;
