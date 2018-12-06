import React, { Component } from "react";
import MatchupBubble from "./MatchupBubble";

class AdvantageMatchups extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    this.orderMatchUps();
  }

  orderMatchUps() {
    const { data, curChampId } = this.props;
    let sortedAdvantages = data.sort(function(a, b) {
      let aChampWR, bChampWR;
      if (a.champ1_id === curChampId) {
        aChampWR = a.champ1.winrate;
      } else {
        aChampWR = a.champ2.winrate;
      }

      if (b.champ1_id === curChampId) {
        bChampWR = b.champ1.winrate;
      } else {
        bChampWR = b.champ2.winrate;
      }

      if (aChampWR > bChampWR) {
        return -1;
      } else if (aChampWR < bChampWR) {
        return 1;
      }
      return 0;
    });
    this.setState({ sortedAdvantages: sortedAdvantages });
  }

  render() {
    const { curChampId, championName } = this.props;
    const { sortedAdvantages } = this.state;
    if (sortedAdvantages) {
      return (
        <div style={{ width: 600, height: "auto" }}>
          <div
            style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
            Advantage Matchups
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly"
            }}>
            {sortedAdvantages.map((matchup, index) => {
              if (index < 7) {
                let champWR, enemyChamp, enemyWR;
                if (matchup.champ1_id === curChampId) {
                  champWR = matchup.champ1.winrate;
                  enemyChamp = matchup.champ2_id;
                  enemyWR = matchup.champ2.winrate;
                } else {
                  champWR = matchup.champ2.winrate;
                  enemyChamp = matchup.champ1_id;
                  enemyWR = matchup.champ1.winrate;
                }
                return (
                  <MatchupBubble
                    key={index + "_matchup"}
                    matchup={matchup}
                    curChampId={curChampId}
                    championName={championName}
                    champWR={champWR}
                    enemyChampId={enemyChamp}
                    enemyWR={enemyWR}
                  />
                );
              }
            })}
          </div>
        </div>
      );
    }
    return <div />;
  }
}

export default AdvantageMatchups;
