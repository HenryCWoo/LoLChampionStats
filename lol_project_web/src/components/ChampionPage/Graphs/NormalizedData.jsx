import React, { Component } from "react";
import {
  BarChart,
  Bar,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

class CustomTick extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { active } = this.props;

    if (active) {
      const { payload } = this.props;
      return (
        <div style={{ backgroundColor: "white", padding: 5 }}>
          <div style={{ textAlign: "center", fontSize: 10 }}>{`${
            payload[0].name
          }\n${payload[0].value}%`}</div>
        </div>
      );
    }

    return null;
  }
}

class CustomTooltip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { active, payload } = this.props;

    if (active && payload.length > 0) {
      const { payload } = this.props;
      return (
        <div style={{ backgroundColor: "white", padding: 5 }}>
          <div style={{ textAlign: "center", fontSize: 10 }}>{`${
            payload[0].payload.name
          }\n${(100 * payload[0].payload.rate).toFixed(2)}%`}</div>
        </div>
      );
    }

    return null;
  }
}

class NormalizedData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const { data } = this.props;

    let normalizedData = [
      { name: "Win Rate", rate: data.winRate, val: data.winRate - 0.5 },
      { name: "Play Rate", rate: data.playRate, val: data.playRate - 0.5 },
      { name: "Ban Rate", rate: data.banRate, val: data.banRate - 0.5 },
      {
        name: "Gold Earned",
        rate: data.goldEarned,
        val: data.goldEarned - 0.5
      },
      { name: "Kills", rate: data.kills, val: data.kills - 0.5 },
      { name: "Deaths", rate: data.deaths, val: data.deaths - 0.5 },
      { name: "Assists", rate: data.assists, val: data.assists - 0.5 },
      {
        name: "Damage Dealt",
        rate: data.totalDamageDealt,
        val: data.totalDamageDealt - 0.5
      },
      {
        name: "Damage Taken",
        rate: data.totalDamageTaken,
        val: data.totalDamageTaken - 0.5
      },
      { name: "Healing Done", rate: data.totalHeal, val: data.totalHeal - 0.5 },
      {
        name: "Minions Killed",
        rate: data.minionsKilled,
        val: data.minionsKilled - 0.5
      },
      {
        name: "Team Jungle Minions Killed",
        rate: data.neutralMinionsKilledTeamJungle,
        val: data.neutralMinionsKilledTeamJungle - 0.5
      },
      {
        name: "Enemy Jungle Minions Killed",
        rate: data.neutralMinionsKilledEnemyJungle,
        val: data.neutralMinionsKilledEnemyJungle - 0.5
      }
    ];

    this.setState({ data: normalizedData });
  }

  render() {
    return (
      <div style={{ width: 500 }}>
        <div
          style={{
            fontWeight: "bold",
            position: "relative",
            textAlign: "center",
            color: "white",
            margin: 10
          }}>
          Percentiles Compared to Other Champions
        </div>
        <BarChart
          width={500}
          height={600}
          data={this.state.data}
          margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
          layout="vertical">
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, color: "white", stroke: "white", width: 150 }}
          />
          <XAxis type="number" domain={[-0.5, 0.5]} tick={false} hide={true} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="white" strokeWidth={3} />
          <Bar dataKey="val" fill={this.props.palette.Vibrant} barSize={15} />
        </BarChart>
      </div>
    );
  }
}

export default NormalizedData;
