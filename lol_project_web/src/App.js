import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
// import ChampionListing from "./components/ChampionListing";
import EnhancedTable from "./components/ChampionListing/ChampionListing.jsx";

class App extends Component {
  render() {
    return <EnhancedTable />;
  }
}

export default App;
