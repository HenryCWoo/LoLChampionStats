import React, { Component } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Sector, Cell, Tooltip } from "recharts";

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
          <div style={{ textAlign: "center", fontSize: 10 }}>{`${
            payload[0].name
          }\n${payload[0].value}%`}</div>
        </div>
      );
    }

    return null;
  }
}

class DamageComposition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      colors: []
    };
  }

  componentDidMount() {
    const { data, palette } = this.props;

    let dmgComp = [];
    dmgComp.push({
      name: "Physical Damage",
      value: Math.round(data.percentPhysical * 10000) / 100
    });
    dmgComp.push({
      name: "Magic Damage",
      value: Math.round(data.percentMagical * 10000) / 100
    });
    dmgComp.push({
      name: "True Damage",
      value: Math.round(data.percentTrue * 10000) / 100
    });

    let colors = [palette.Vibrant, palette.DarkVibrant, palette.LightVibrant];
    this.setState({ data: dmgComp, colors: colors });
  }

  render() {
    const { data, colors } = this.state;
    return (
      <div style={{ width: 170, height: 110 }}>
        <PieChart width={170} height={100}>
          <Pie
            data={data}
            cx={80}
            cy={90}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}>
            {data.map((entry, index) => (
              <Cell fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
        <div
          style={{
            fontWeight: "bold",
            position: "relative",
            textAlign: "center",
            color: "white"
          }}>
          Damage Composition
        </div>
      </div>
    );
  }
}

export default DamageComposition;
