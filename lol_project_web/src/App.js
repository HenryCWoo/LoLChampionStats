import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import ChampionListing from "./components/ChampionListing/ChampionListing.jsx";
import ChampionPage from "./components/ChampionPage/ChampionPage.jsx";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <Route path="/" exact component={ChampionListing} />
            <Route
              path="/champion/:league/:championName/:role"
              component={ChampionPage}
            />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
