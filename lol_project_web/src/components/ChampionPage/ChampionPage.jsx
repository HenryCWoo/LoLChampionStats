import React, { Component } from "react";
import * as Vibrant from "node-vibrant";

import { leagueMapping } from "../ChampionListing/ChampionListingConstants";
import "./ChampionPage.css";
import Helmet from "react-helmet";

// Import graphs to display statistics
import GeneralStatistics from "./Graphs/GeneralStatistics";
import DamageComposition from "./Graphs/DamageComposition";
import NormalizedData from "./Graphs/NormalizedData";
import WinsByMatchLength from "./Graphs/WinsByMatchLength";
import WinsByMatchesPlayed from "./Graphs/WinsByMatchesPlayed";

const rgbHex = require("rgb-hex");

class ChampionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      championData: null,
      palette: null
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

    this.generalGetRequest(
      `http://127.0.0.1:5000/champion_by_name/${params.championName}`,
      "championData"
    );
    Vibrant.from(
      require(`../../static/images/${params.championName}/${
        params.championName
      }_splash.jpg`)
    ).getPalette((err, palette) => {
      console.log(palette);
      let palettes = {};
      for (let theme in palette) {
        if (palette[theme]) {
          palettes[[theme]] =
            "#" +
            rgbHex(
              palette[theme]["r"],
              palette[theme]["g"],
              palette[theme]["b"]
            );
        } else {
          palettes[[theme]] = "#ffffff";
        }
      }
      this.setState({ palette: palettes });
    });
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

  championProfile() {
    const { params } = this.props.match;
    const { palette, championData } = this.state;

    if (palette && championData) {
      return (
        <div>
          <div style={{ color: palette.LightVibrant }} className="profileName">
            {championData.name}
          </div>
          <div style={{ color: palette.LightVibrant }} className="titleName">
            {championData.title}
          </div>

          <img
            src={require(`../../static/images/${params.championName}/${
              params.championName
            }_loading.jpg`)}
            className="profileImage"
          />
          {this.textSample()}
        </div>
      );
    }
  }

  statisticsPanel() {
    const { palette, championData, data } = this.state;
    if (palette && championData && data) {
      return (
        <div
          className="statsPanel"
          style={{
            backgroundColor: palette.DarkMuted + "80",
            display: "flex",
            flexDirection: "row"
          }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <GeneralStatistics data={data} />
            <DamageComposition
              data={data.damageComposition}
              palette={palette}
            />
            <WinsByMatchLength
              data={data.winsByMatchLength}
              palette={palette}
            />
            <WinsByMatchesPlayed
              data={data.winsByMatchesPlayed}
              palette={palette}
            />
          </div>
          <div style={{ margin: 20, marginLeft: 100 }}>
            <NormalizedData data={data.normalized} palette={palette} />
          </div>
        </div>
      );
    }
  }

  textSample() {
    const { palette } = this.state;
    if (!palette) {
      return;
    }
    return (
      <div>
        <div style={{ color: palette.DarkMuted }}>
          Text with the darkMuted color
        </div>
        <div style={{ color: palette.DarkVibrant }}>
          Text with the darkVibrant color
        </div>
        <div style={{ color: palette.LightMuted }}>
          Text with the lightMuted color
        </div>
        <div style={{ color: palette.LightVibrant }}>
          Text with the lightVibrant color
        </div>
        <div style={{ color: palette.Muted }}>Text with the muted color</div>
        <div style={{ color: palette.Vibrant }}>
          Text with the vibrant color
        </div>
      </div>
    );
  }

  render() {
    const { params } = this.props.match;

    return (
      <div>
        <Helmet bodyAttributes={{ style: "background-color: black" }} />
        <img
          src={require(`../../static/images/${params.championName}/${
            params.championName
          }_splash.jpg`)}
          className="backgroundImage"
        />
        <div className="mainBody">
          <div className="innerBody">
            {this.championProfile()}

            {this.statisticsPanel()}
          </div>
        </div>
      </div>
    );
  }
}

export default ChampionPage;
