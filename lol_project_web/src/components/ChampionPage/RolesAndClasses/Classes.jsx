import React, { Component } from "react";

const classToIconMapping = {
  Assassin: "assassin_icon.png",
  Support: "controller_icon.png",
  Mage: "mage_icon.png",
  Tank: "tank_icon.png",
  Fighter: "fighter_icon.png"
};

class Classes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { tags, palette } = this.props;
    return (
      <div>
        <div
          style={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10
          }}>
          Classes
        </div>
        {tags.map(tag => (
          <img
            key={tag + "_classes"}
            src={require(`../../../static/Roles/${classToIconMapping[tag]}`)}
            style={{ width: 50, height: "auto" }}
          />
        ))}
      </div>
    );
  }
}

export default Classes;
