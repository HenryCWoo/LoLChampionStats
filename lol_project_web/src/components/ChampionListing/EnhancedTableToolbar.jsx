import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  },
  dropdownRoot: {
    display: "flex",
    flexDirection: "row"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    marginTop: theme.spacing.unit
  }
});

export const DEFAULT_LEAGUE = "Platinum+";
export const DEFAULT_ROLE = "All";

class EnhancedTableToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      league: DEFAULT_LEAGUE,
      leagues: ["Platinum+", "Platinum", "Gold", "Silver", "Bronze"],
      role: DEFAULT_ROLE,
      roles: ["All", "ADC", "Support", "Jungle", "Middle", "Top"]
    };
  }

  handleTextChange = name => event => {
    this.setState(
      {
        [name]: event.target.value
      },
      this.sendToolbarParams
    );
  };

  handleChange = event => {
    if (event.target.name === "league") {
      this.setState(
        { [event.target.name]: event.target.value, role: DEFAULT_ROLE },
        this.sendToolbarParams
      );
    } else {
      this.setState(
        { [event.target.name]: event.target.value },
        this.sendToolbarParams
      );
    }
  };

  sendToolbarParams() {
    this.props.getToolbarParams(
      this.state.name,
      this.state.league,
      this.state.role
    );
  }

  createDropdown(displayValue, allValues, Label) {
    const { classes } = this.props;
    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor={Label + "-simple"}>{Label}</InputLabel>
        <Select
          value={displayValue}
          onChange={this.handleChange}
          inputProps={{
            name: Label.toLowerCase(),
            id: Label + "-simple"
          }}>
          {allValues.map(value => {
            return (
              <MenuItem value={value} key={value + Label}>
                {value}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <Toolbar>
        <div>
          <div className={classes.title}>
            <Typography variant="h6" id="tableTitle">
              Champion Statistics
            </Typography>
            <Typography variant="subtitle1" id="tableTitle">
              {"Patch " + this.props.patchVersion}
            </Typography>
          </div>
          <div className={classes.spacer} />
          <div className={classes.dropdownRoot}>
            <TextField
              id="standard-name"
              label="Search"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleTextChange("name")}
              placeholder="Filter by name"
            />
            {this.createDropdown(
              this.state.league,
              this.state.leagues,
              "League"
            )}
            {this.createDropdown(this.state.role, this.state.roles, "Role")}
          </div>
        </div>
        <div className={classes.spacer} />
      </Toolbar>
    );
  }
}

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default (EnhancedTableToolbar = withStyles(toolbarStyles, {
  withTheme: true
})(EnhancedTableToolbar));
