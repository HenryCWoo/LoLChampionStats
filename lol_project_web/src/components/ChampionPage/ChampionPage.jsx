import React, { Component } from "react";
import * as Vibrant from "node-vibrant";
import Fade from "react-reveal/Fade";
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button";

import {
  leagueMapping,
  reverseRoleMapping
} from "../ChampionListing/ChampionListingConstants";
import "./ChampionPage.css";
import Helmet from "react-helmet";

// Import graphs to display statistics
import GeneralStatistics from "./Graphs/GeneralStatistics";
import DamageComposition from "./Graphs/DamageComposition";
import NormalizedData from "./Graphs/NormalizedData";
import WinsByMatchLength from "./Graphs/WinsByMatchLength";
import WinsByMatchesPlayed from "./Graphs/WinsByMatchesPlayed";
import Classes from "./RolesAndClasses/Classes";
import Roles from "./RolesAndClasses/Roles";
import AdvantageMatchups from "./Matchups/Matchups";
import {
  setSessionItem,
  getSessionItem,
  SESSIONKEYS
} from "../SessionStorage/SessionStorageUtils";
import ChampionBuild from "./ChampionBuild/ChampionBuild";
import MenuBar from "../MenuBar/MenuBar";

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

  changeData() {
    const { params } = this.props.match;
    this.generalGetRequest(
      `http://127.0.0.1:5000/single_champion/${leagueMapping[params.league]}/${
        params.championName
      }/${reverseRoleMapping[params.role]}`,
      "data",
      SESSIONKEYS.RIOT_CHAMPION_DATA +
        params.championName +
        params.role +
        params.league
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps != this.props) {
      this.componentDidMount();
    }
    console.log(this.state.championData);
    console.log(this.state.data);
  }

  componentDidMount() {
    const { params } = this.props.match;
    this.generalGetRequest(
      `http://127.0.0.1:5000/single_champion/${leagueMapping[params.league]}/${
        params.championName
      }/${reverseRoleMapping[params.role]}`,
      "data",
      SESSIONKEYS.RIOT_CHAMPION_DATA +
        params.championName +
        params.role +
        params.league
    );

    this.generalGetRequest(
      `http://127.0.0.1:5000/champion_by_name/${params.championName}`,
      "championData",
      SESSIONKEYS.RIOT_CHAMPION_DATA + params.championName
    );
    Vibrant.from(
      require(`../../static/images/${params.championName}/${
        params.championName
      }_splash.jpg`)
    ).getPalette((err, palette) => {
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

  generalGetRequest(url, stateVar, sessionVar) {
    let sessionData = getSessionItem(sessionVar);
    if (sessionData) {
      this.setState({ [stateVar]: JSON.parse(sessionData) });
      return;
    }
    fetch(url, {
      method: "GET",
      cache: "no-cache"
    })
      .catch(error => console.log(error))
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ [stateVar]: responseJson });
        setSessionItem(sessionVar, JSON.stringify(responseJson));
      });
  }

  championProfile() {
    const { params } = this.props.match;
    const { palette, championData } = this.state;

    if (palette && championData) {
      return (
        <Fade left>
          <div>
            <Fade left>
              <div
                style={{ color: palette.LightVibrant }}
                className="profileName">
                {championData.name}
              </div>
            </Fade>
            <Fade left>
              <div
                style={{ color: palette.LightVibrant }}
                className="titleName">
                {championData.title}
              </div>
            </Fade>
            <img
              src={require(`../../static/images/${params.championName}/${
                params.championName
              }_loading.jpg`)}
              className="profileImage"
            />

            {/* {this.textSample()} */}
          </div>
        </Fade>
      );
    }
  }

  statisticsPanel() {
    const { params } = this.props.match;
    const { palette, championData, data } = this.state;
    if (palette && championData && data) {
      return (
        <Fade big>
          <div
            className="statsPanel"
            style={{
              backgroundColor: palette.DarkMuted + "80",
              display: "flex",
              flexDirection: "row",
              padding: 20
            }}>
            {/* VERTICAL SECTION ON LEFT HAND SIDE */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly"
                }}>
                <Roles palette={palette} params={params} />
                <Classes tags={championData.tags} palette={palette} />
                <DamageComposition
                  data={data.damageComposition}
                  palette={palette}
                />
              </div>
              <GeneralStatistics data={data} />
              <div style={{ margin: 20 }} />
              <AdvantageMatchups
                curChampId={data.championId}
                championName={championData.name}
                data={data.matchups[data.role]}
                palette={palette}
              />
              <div style={{ margin: 30 }} />
              <ChampionBuild data={data.hashes} palette={palette} />
            </div>

            {/* VERTICAL SECTION ON THE RIGHT HAND SIDE */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
              <NormalizedData data={data.normalized} palette={palette} />
              <div style={{ margin: 10 }} />
              <WinsByMatchLength
                data={data.winsByMatchLength}
                palette={palette}
              />
              <div style={{ margin: 10 }} />
              <WinsByMatchesPlayed
                data={data.winsByMatchesPlayed}
                palette={palette}
              />
            </div>
          </div>
        </Fade>
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
    const { palette } = this.state;
    const { params } = this.props.match;

    console.log(params);
    return (
      <div>
        <div>
          <MenuBar params={params} palette={palette} />
          <Helmet bodyAttributes={{ style: "background-color: black" }} />
          <img
            src={require(`../../static/images/${params.championName.replace(
              /\s/g,
              ""
            )}/${params.championName.replace(/\s/g, "")}_splash.jpg`)}
            className="backgroundImage"
          />
          <ScrollUpButton style={{ width: 30, height: 30 }} />
          <div className="mainBody">
            <div className="innerBody">
              {this.championProfile()}
              {this.statisticsPanel()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChampionPage;
