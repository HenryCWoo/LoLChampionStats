import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import { PieChart, Pie, Sector, Cell, Tooltip, Legend } from "recharts";
import { Avatar } from "@material-ui/core";

class MatchupBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      colors: ["#49964c", "#ED4337"],
      enemyChampName: { name: "" }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.componentDidMount();
    }
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

  setData() {
    const {
      matchup,
      curChampId,
      championName,
      champWR,
      enemyChampId,
      enemyWR
    } = this.props;
    let data = [];
    data.push({ name: championName, value: champWR });
    data.push({
      name: this.state.enemyChampName.name,
      value: enemyWR
    });

    this.setState({ data: data });
  }

  componentDidMount() {
    this.generalGetRequest(
      `http://127.0.0.1:5000/champion_id/${this.props.enemyChampId}`,
      "enemyChampName"
    );
    this.setData();
  }

  renderAvatar() {
    if (this.state.enemyChampName.name !== "") {
      return (
        <div style={{ position: "absolute", top: 25, left: 25 }}>
          <Avatar
            src={require(`../../../static/images/${
              this.state.enemyChampName.name
            }/${this.state.enemyChampName.name}_square.jpg`)}
          />
        </div>
      );
    }
  }

  render() {
    const { data, colors } = this.state;
    return (
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <PieChart width={90} height={90}>
            <Pie
              data={data}
              cx={40}
              cy={40}
              startAngle={270}
              endAngle={-270}
              innerRadius={30}
              outerRadius={35}
              paddingAngle={5}>
              {data.map((entry, index) => (
                <Cell
                  key={index + "_matchup_color"}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </div>

        {this.renderAvatar()}
      </div>
    );
  }
}

export default MatchupBubble;
