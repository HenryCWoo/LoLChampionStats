import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { PieChart, Pie, Legend } from "recharts";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: { maxWidth: 400 }
});

class GeneralStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: []
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props != prevProps) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    this.createRows();
  }

  createRows() {
    const { data } = this.props;
    let id = 0;
    function createData(type, average, placement, placementDelta) {
      id += 1;
      return { id, type, average, placement, placementDelta };
    }

    const rows = [
      createData(
        "Win Rate",
        (data.winRate * 100).toFixed(2) + "%",
        data.positions.winRates,
        data.positions.winRates - data.positions.previousWinRates
      ),
      createData(
        "Play Rate",
        (data.playRate * 100).toFixed(2) + "%",
        data.positions.playRates,
        data.positions.playRates
      ),
      createData(
        "Ban Rate",
        (data.banRate * 100).toFixed(2) + "%",
        data.positions.banRates,
        data.positions.banRates - data.positions.previousBanRates
      ),
      createData(
        "Gold Earned",
        data.goldEarned.toFixed(0),
        data.positions.goldEarned,
        data.positions.goldEarned - data.positions.previousGoldEarned
      ),
      createData(
        "KDA",
        data.kills.toFixed(2) +
          "/" +
          data.deaths.toFixed(2) +
          "/" +
          data.assists.toFixed(2),
        data.positions.kills +
          "/" +
          data.positions.deaths +
          "/" +
          data.positions.assists,
        data.positions.kills -
          data.positions.previousKills +
          "/" +
          (data.positions.deaths - data.positions.previousDeaths) +
          "/" +
          (data.positions.assists - data.positions.previousAssists)
      ),
      createData(
        "Damage Dealt",
        data.damageComposition.total.toFixed(0),
        data.positions.damageDealt,
        data.positions.damageDealt - data.positions.previousDamageDealt
      ),
      createData(
        "Damage Taken",
        data.totalDamageTaken.toFixed(0),
        data.positions.totalDamageTaken,
        data.positions.totalDamageTaken -
          data.positions.previousTotalDamageTakenPosition
      )
    ];
    this.setState({ rows });
  }

  render() {
    const { classes } = this.props;

    return (
      <div style={{ margin: 10 }}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
                Average
              </TableCell>
              <TableCell
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                Role Placement
              </TableCell>
              <TableCell
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                Placement Change this Patch
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map(row => {
              return (
                <TableRow key={row.id} hover>
                  <TableCell
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold"
                    }}>
                    {row.type}
                  </TableCell>
                  <TableCell style={{ color: "white", fontSize: 16 }}>
                    {row.average}
                  </TableCell>
                  <TableCell style={{ color: "white", fontSize: 16 }}>
                    {row.placement}
                  </TableCell>
                  <TableCell style={{ color: "white", fontSize: 16 }}>
                    {row.placementDelta}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

GeneralStatistics.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GeneralStatistics);
