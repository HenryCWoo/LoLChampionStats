import React, { Component } from "react";
import ItemRow from "./ItemRow";

class ChampionBuild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props != prevProps) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    const { data } = this.props;

    if (!data) {
      return;
    }
    // DEEP COPY (efficient way suggested on stackoverflow)
    let copiedData = JSON.stringify(data);
    copiedData = JSON.parse(copiedData);

    for (var section in copiedData) {
      for (var countOrRate in copiedData[section]) {
        let hash = copiedData[section][countOrRate]["hash"];
        copiedData[section][countOrRate]["hash"] = hash.split("-");
      }
    }
    this.setState({ data: copiedData });
  }

  render() {
    const { data } = this.state;
    const { palette } = this.props;

    if (!data) {
      return <div />;
    }
    return (
      <div>
        <ItemRow
          data={data.firstitemshash}
          title={"First Build"}
          palette={palette}
        />
        <div style={{ margin: 30 }} />
        <ItemRow
          data={data.finalitemshashfixed}
          title={"Final Build"}
          palette={palette}
        />
        <div style={{ margin: 30 }} />
        <ItemRow data={data.trinkethash} title={"Trinket"} palette={palette} />
      </div>
    );
  }
}

export default ChampionBuild;
