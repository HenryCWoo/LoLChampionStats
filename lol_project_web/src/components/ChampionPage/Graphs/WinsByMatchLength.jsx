import React, { Component } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
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
            {payload[0].payload.name} Minute Games
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

class WinsByMatchLength extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  componentDidMount() {
    const { data } = this.props;
    let min = data.zeroToFifteen.count;
    let max = data.zeroToFifteen.count;
    for (var key in data) {
      let curCount = data[key].count;
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

    let matchLengthData = [
      {
        name: "0-15",
        rate: data.zeroToFifteen.winRate,
        games: data.zeroToFifteen.count,
        countMinMaxScaled: minMaxScale(data.zeroToFifteen.count, max, min)
      },
      {
        name: "15-20",
        rate: data.fifteenToTwenty.winRate,
        games: data.fifteenToTwenty.count,
        countMinMaxScaled: minMaxScale(data.fifteenToTwenty.count, max, min)
      },
      {
        name: "20-25",
        rate: data.twentyToTwentyFive.winRate,
        games: data.twentyToTwentyFive.count,
        countMinMaxScaled: minMaxScale(data.twentyToTwentyFive.count, max, min)
      },
      {
        name: "25-30",
        rate: data.twentyFiveToThirty.winRate,
        games: data.twentyFiveToThirty.count,
        countMinMaxScaled: minMaxScale(data.twentyFiveToThirty.count, max, min)
      },
      {
        name: "30-35",
        rate: data.thirtyToThirtyFive.winRate,
        games: data.thirtyToThirtyFive.count,
        countMinMaxScaled: minMaxScale(data.thirtyToThirtyFive.count, max, min)
      },
      {
        name: "35-40",
        rate: data.thirtyFiveToForty.winRate,
        games: data.thirtyFiveToForty.count,
        countMinMaxScaled: minMaxScale(data.thirtyFiveToForty.count, max, min)
      },
      {
        name: "40+",
        rate: data.fortyPlus.winRate,
        games: data.fortyPlus.count,
        countMinMaxScaled: minMaxScale(data.fortyPlus.count, max, min)
      }
    ];
    this.setState({ data: matchLengthData });
  }

  render() {
    const { palette } = this.props;
    return (
      <div style={{ width: 600, height: 400 }}>
        <div
          style={{
            fontWeight: "bold",
            position: "relative",
            textAlign: "center",
            color: "white"
          }}>
          Win Rates by Match Length
        </div>
        <ComposedChart
          width={600}
          height={400}
          data={this.state.data}
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
    );
  }
}

export default WinsByMatchLength;
