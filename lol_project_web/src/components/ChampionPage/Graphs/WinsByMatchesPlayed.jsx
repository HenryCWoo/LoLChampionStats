import React, { Component } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell
} from "recharts";

class CustomTooltip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { active } = this.props;
    if (active) {
      const { payload } = this.props;
      return (
        <div style={{ backgroundColor: "white", padding: 5 }}>
          <div style={{ textAlign: "center", fontSize: 10 }}>
            {payload[0].payload.name} Matches Played
          </div>
          <div style={{ textAlign: "center", fontSize: 10 }}>
            Win Rate: {(100 * payload[0].payload.rate).toFixed(2)}%
          </div>
          <div style={{ textAlign: "center", fontSize: 10 }}>
            Games Analyzed: {payload[0].payload.games}
          </div>
        </div>
      );
    }

    return null;
  }
}

class CustomPlayersTooltip extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { active } = this.props;
    if (active) {
      const { payload } = this.props;
      return (
        <div style={{ backgroundColor: "white", padding: 5 }}>
          <div style={{ textAlign: "center", fontSize: 10 }}>
            {payload[0].payload.name} Matches Played
          </div>
          <div style={{ textAlign: "center", fontSize: 10 }}>
            Win Rate: {(100 * payload[0].payload.rate).toFixed(2)}%
          </div>
          <div style={{ textAlign: "center", fontSize: 10 }}>
            Games Analyzed: {payload[0].payload.games}
          </div>
        </div>
      );
    }

    return null;
  }
}

class WinsByMatchesPlayed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props != prevProps) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    const { data } = this.props;
    let min = data.oneToFifty.gamesPlayed;
    let max = data.oneToFifty.gamesPlayed;
    for (var key in data) {
      let curCount = data[key].gamesPlayed;
      if (curCount < min) {
        min = curCount;
      }
      if (curCount > max) {
        max = curCount;
      }
    }

    function minMaxScale(val, max, min) {
      return ((val - min) / (max - min)) * (0.4 - 0.05) + 0.05;
    }

    let playerCountData = [
      { name: "1-50", value: data.oneToFifty.players },
      { name: "51-100", value: data.fiftyOneToHundred.players },
      { name: "101-150", value: data.hundredOneToHundredFifty.players },
      { name: "151-200", value: data.hundredFiftyOneToTwoHundred.players },
      { name: "201+", value: data.twoHundredOnePlus.players }
    ];

    let experienceData = [
      {
        name: "1-50",
        rate: data.oneToFifty.winRate,
        games: data.oneToFifty.gamesPlayed,
        countMinMaxScaled: minMaxScale(data.oneToFifty.gamesPlayed, max, min),
        players: data.oneToFifty.players
      },
      {
        name: "51-100",
        rate: data.fiftyOneToHundred.winRate,
        games: data.fiftyOneToHundred.gamesPlayed,
        countMinMaxScaled: minMaxScale(
          data.fiftyOneToHundred.gamesPlayed,
          max,
          min
        ),
        players: data.fiftyOneToHundred.players
      },
      {
        name: "101-150",
        rate: data.hundredOneToHundredFifty.winRate,
        games: data.hundredOneToHundredFifty.gamesPlayed,
        countMinMaxScaled: minMaxScale(
          data.hundredOneToHundredFifty.gamesPlayed,
          max,
          min
        ),
        players: data.hundredOneToHundredFifty.players
      },
      {
        name: "151-200",
        rate: data.hundredFiftyOneToTwoHundred.winRate,
        games: data.hundredFiftyOneToTwoHundred.gamesPlayed,
        countMinMaxScaled: minMaxScale(
          data.hundredFiftyOneToTwoHundred.gamesPlayed,
          max,
          min
        ),
        players: data.hundredFiftyOneToTwoHundred.players
      },
      {
        name: "201+",
        rate: data.twoHundredOnePlus.winRate,
        games: data.twoHundredOnePlus.gamesPlayed,
        countMinMaxScaled: minMaxScale(
          data.twoHundredOnePlus.gamesPlayed,
          max,
          min
        ),
        players: data.twoHundredOnePlus.players
      }
    ];
    this.setState({ data: experienceData, playersData: playerCountData });
  }

  render() {
    const { palette } = this.props;
    const { data, playersData } = this.state;

    let colors = [
      palette.Vibrant,
      palette.LightVibrant,
      palette.DarkVibrant,
      palette.Muted,
      palette.LightMuted
    ];

    return (
      <div>
        <div
          style={{
            fontWeight: "bold",
            position: "relative",
            textAlign: "center",
            color: "white"
          }}>
          Win Rates by Matches Played
        </div>
        <div
          style={{
            width: 600,
            height: 400,
            display: "flex",
            flexDirection: "row"
          }}>
          <div>
            <ComposedChart
              width={400}
              height={300}
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis dataKey="name" style={{ fontSize: 12 }} />
              <YAxis domain={[0, 1]} style={{ fontSize: 12 }} />
              <ReferenceLine y={0.5} stroke="white" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "white" }} verticalAlign="top" />
              <Area
                name="Win Rate"
                type="monotone"
                dataKey="rate"
                fill={palette.Vibrant}
                stroke={palette.Muted}
              />
              <Bar
                name="Games Analyzed"
                dataKey="countMinMaxScaled"
                barSize={20}
                fill={palette.LightVibrant}
              />
            </ComposedChart>
          </div>

          <div style={{ marginTop: 10 }}>
            <PieChart width={170} height={250}>
              <Pie
                data={playersData}
                cx={80}
                cy={140}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell
                    key={index + "_pie_graph"}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Legend
                wrapperStyle={{ color: "white" }}
                verticalAlign="top"
                height={36}
              />
              <Tooltip content={<CustomPlayersTooltip />} />
            </PieChart>
          </div>
        </div>
      </div>
    );
  }
}

export default WinsByMatchesPlayed;
