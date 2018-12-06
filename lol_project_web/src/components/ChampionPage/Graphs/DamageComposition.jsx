import React, { Component } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Sector, Cell, Tooltip, Legend } from "recharts";

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

  componentDidUpdate(prevProps) {
    if (this.props != prevProps) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    const { data, palette } = this.props;

    let dmgComp = [];
    dmgComp.push({
      name: "Physical",
      value: Math.round(data.percentPhysical * 10000) / 100
    });
    dmgComp.push({
      name: "Magic",
      value: Math.round(data.percentMagical * 10000) / 100
    });
    dmgComp.push({
      name: "True",
      value: Math.round(data.percentTrue * 10000) / 100
    });

    let colors = [palette.Vibrant, palette.DarkVibrant, palette.LightVibrant];
    this.setState({ data: dmgComp, colors: colors });
  }

  render() {
    const { data, colors } = this.state;
    return (
      <div style={{ width: 190, height: 150 }}>
        <PieChart width={190} height={120}>
          <Pie
            data={data}
            cx={90}
            cy={90}
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={90}
            paddingAngle={5}>
            {data.map((entry, index) => (
              <Cell
                key={index + "_damage_comp"}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Legend
            wrapperStyle={{
              color: "white",
              fontSize: 10,
              marginLeft: 6
            }}
            verticalAlign="bottom"
          />
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
