import React, { Component } from "react";
import { leagueMapping } from "../ChampionListing/ChampionListingConstants";
import "./ChampionPage.css";

class ChampionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentWillReceiveProps() {}

  componentDidUpdate() {
    console.log(this.state);
  }

  componentDidMount() {
    const { params } = this.props.match;
    this.generalGetRequest(
      `http://127.0.0.1:5000/single_champion/${leagueMapping[params.league]}/${
        params.championName
      }`,
      "data"
    );
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

  render() {
    const { params } = this.props.match;

    return (
      <div>
        <img
          src={require(`../../static/images/${params.championName}/${
            params.championName
          }_splash.jpg`)}
          className="backgroundImage"
        />
        <div className="mainBody">
          <div>{params.league}</div>
          <div>{params.role}</div>
          <div>
            {this.state.data.map(data => {
              return <div>{JSON.stringify(data)}</div>;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default ChampionPage;
