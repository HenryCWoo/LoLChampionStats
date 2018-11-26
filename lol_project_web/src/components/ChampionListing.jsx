import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";

class ChampionListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      championId: []
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

  componentWillMount() {
    this.generalGetRequest(
      "http://127.0.0.1:5000/champion_data/bronze",
      "data"
    );
    this.generalGetRequest("http://127.0.0.1:5000/champion_id", "championId");
  }

  componentDidUpdate() {
    console.log(this.state.data);
    console.log(this.state.championId);
  }

  render() {
    const columns = [
      {
        Header: "Name",
        accessor: "championId"
      },
      {
        Header: "Win Rate",
        accessor: "winRate"
      }
    ];

    return <ReactTable data={this.state.data} columns={columns} />;
  }
}

export default ChampionListing;
