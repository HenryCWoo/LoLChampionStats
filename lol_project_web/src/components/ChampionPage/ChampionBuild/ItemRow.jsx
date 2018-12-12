import React, { Component } from "react";
import { Avatar } from "@material-ui/core";

class ItemRow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (this.props != prevProps) {
      this.componentDidMount();
    }
  }

  componentDidMount() {}

  isNumeric(num) {
    return !isNaN(num);
  }

  getImages(object) {
    if (!object) {
      return <div />;
    }
    return (
      <div style={{ display: "flex", justifyContent: "row" }}>
        {object.hash.map(value => {
          if (this.isNumeric(value)) {
            return (
              <Avatar
                src={require("../../../static/items/" + value + ".png")}
                width={50}
                height={50}
              />
            );
          }
        })}
      </div>
    );
  }

  displayNumStats(stats) {
    const { palette } = this.props;
    if (stats.winrate && stats.count) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ marginRight: 6 }}>{"Winrate "}</div>
            <div style={{ color: palette.LightVibrant }}>
              {(100 * stats.winrate).toFixed(2)}%
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ marginRight: 6 }}>{"Games "}</div>
            <div style={{ color: palette.LightVibrant }}> {stats.count}</div>
          </div>
        </div>
      );
    }
  }

  render() {
    const { data, title } = this.props;
    if (!data) {
      return <div />;
    }
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
        <div style={{ color: "white", fontWeight: "bold" }}>{title}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%"
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "white"
            }}>
            <div style={{ marginBottom: 6 }}>Most Frequent</div>
            {this.getImages(data.highestCount)}
            {this.displayNumStats(data.highestCount)}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "white"
            }}>
            <div style={{ marginBottom: 6 }}>Highest Winrate</div>
            {this.getImages(data.highestWinrate)}
            {this.displayNumStats(data.highestWinrate)}
          </div>
        </div>
      </div>
    );
  }
}

export default ItemRow;
