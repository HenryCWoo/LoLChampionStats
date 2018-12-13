import React, { Component } from "react";
import PropTypes from "prop-types";
import deburr from "lodash/deburr";
import keycode from "keycode";
import Downshift from "downshift";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Popper from "@material-ui/core/Popper";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";

import { Redirect, withRouter } from "react-router-dom";
import {
  getSessionItem,
  setSessionItem,
  SESSIONKEYS
} from "../SessionStorage/SessionStorageUtils";
import {
  leagueMapping,
  roleMapping
} from "../ChampionListing/ChampionListingConstants";

var suggestions = [];
championIDRequest(SESSIONKEYS.CHAMPION_ID);

function championIDRequest(sessionVar) {
  let sessionData = getSessionItem(sessionVar);
  if (sessionData) {
    let result = [];
    sessionData = JSON.parse(sessionData);
    sessionData.map(set => {
      result.push({ label: set["name"].replace(/([A-Z])/g, " $1").trim() });
    });
    suggestions = result;
    return;
  }
  fetch(`http://127.0.0.1:5000/champion_id`, {
    method: "GET",
    cache: "no-cache"
  })
    .catch(error => console.log(error))
    .then(response => response.json())
    .then(responseJson => {
      let result = [];
      responseJson.map(set => {
        result.push({ label: set["name"].replace(/([A-Z])/g, " $1").trim() });
      });
      suggestions = result;
      setSessionItem(sessionVar, JSON.stringify(responseJson));
    });
}

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  );
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit,
    paddingLeft: 50
  },
  container: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  inputRoot: {
    flexWrap: "wrap"
  },
  inputInput: {
    width: "auto",
    flexGrow: 1
  },
  divider: {
    height: theme.spacing.unit * 2
  }
});

let popperNode;

class IntegrationDownshift extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderSuggestion({
    params,
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;

    const goToChampPage = label => {
      fetch(
        `http://127.0.0.1:5000/champion_roles/${
          leagueMapping[params.league]
        }/${label}`,
        {
          method: "GET",
          cache: "no-cache"
        }
      )
        .catch(error => console.log(error))
        .then(response => response.json())
        .then(responseJson => {
          label = label.replace(/\s/g, "");
          this.props.history.push(
            "/champion/" +
              params.league +
              "/" +
              label +
              "/" +
              roleMapping[responseJson[0].role]
          );
        });
    };

    return (
      <MenuItem
        {...itemProps}
        key={suggestion.label}
        selected={isHighlighted}
        component="div"
        onClick={() => {
          goToChampPage(suggestion.label);
        }}
        style={{
          fontWeight: isSelected ? 500 : 400
        }}>
        {suggestion.label}
      </MenuItem>
    );
  }

  render() {
    const { params, classes } = this.props;

    return (
      <div className={classes.root}>
        <Downshift id="downshift-simple">
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            highlightedIndex,
            inputValue,
            isOpen,
            selectedItem
          }) => (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                InputProps: getInputProps({
                  placeholder: "Search..."
                })
              })}
              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    {getSuggestions(inputValue).map((suggestion, index) =>
                      this.renderSuggestion({
                        params,
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion.label }),
                        highlightedIndex,
                        selectedItem
                      })
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(IntegrationDownshift));
