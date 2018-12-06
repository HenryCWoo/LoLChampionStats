import React, { Component } from "react";
import {
  leagueMapping,
  roleMapping
} from "../../ChampionListing/ChampionListingConstants";
import { withRouter, NavLink } from "react-router-dom";

const roleToIconMapping = {
  Top: "top_icon.png",
  Middle: "middle_icon.png",
  ADC: "bottom_icon.png",
  Support: "support_icon.png",
  Jungle: "jungle_icon.png"
};

class Roles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: []
    };
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

  componentDidMount() {
    const { params } = this.props;
    this.generalGetRequest(
      `http://127.0.0.1:5000/champion_roles/${leagueMapping[params.league]}/${
        params.championName
      }`,
      "roles"
    );
  }

  componentDidUpdate() {}

  switchRole = lane => {
    const { params } = this.props;
    this.props.history.push(
      "/champion/" + params.league + "/" + params.championName + "/" + lane
    );
  };

  render() {
    const { palette, params } = this.props;
    const { roles } = this.state;
    return (
      <div>
        <div
          style={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10
          }}>
          Role
        </div>
        {roles.map(role => {
          let lane = roleMapping[role["role"]];
          return (
            <NavLink
              key={lane + "_role"}
              to={
                "/champion/" +
                params.league +
                "/" +
                params.championName +
                "/" +
                lane
              }>
              <img
                src={require(`../../../static/Roles/${
                  roleToIconMapping[lane]
                }`)}
                style={{
                  width: 50,
                  height: "auto",
                  filter: `opacity(${lane === params.role ? 1 : 0.1})`
                }}
              />
            </NavLink>
          );
        })}
      </div>
    );
  }
}

export default withRouter(Roles);