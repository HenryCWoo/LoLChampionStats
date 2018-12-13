import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FilledInput from "@material-ui/core/FilledInput";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import IntegrationDownshift from "./AutoComplete";

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      suggestions: []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps != this.props) {
      this.componentDidMount();
    }
  }

  componentDidMount() {
    const { params } = this.props;
    if (params) {
      this.setState({ value: params.league });
    }
  }

  handleChange = event => {
    // this.setState({ [event.target.name]: event.target.value });
    this.props.history.push(
      "/champion/" +
        event.target.value +
        "/" +
        this.props.params.championName +
        "/" +
        this.props.params.role
    );
  };

  render() {
    const { palette, classes } = this.props;

    return (
      <MuiThemeProvider
        theme={createMuiTheme({
          palette: {
            primary: {
              light: "#757ce8",
              main: palette ? palette.DarkMuted : "rgba(0, 0, 0, 0)",
              dark: "#002884",
              contrastText: "#fff"
            }
          }
        })}>
        <AppBar color="primary" position="static">
          <Toolbar>
            <div className={classes.grow} />
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="age-simple">
                League
              </InputLabel>
              <Select
                value={this.state.value}
                onChange={this.handleChange.bind(this)}
                inputProps={{
                  name: "age",
                  id: "age-simple"
                }}>
                <MenuItem value="Platinum+">Platinum+</MenuItem>
                <MenuItem value="Platinum">Platinum</MenuItem>
                <MenuItem value="Gold">Gold</MenuItem>
                <MenuItem value="Silver">Silver</MenuItem>
                <MenuItem value="Bronze">Bronze</MenuItem>
              </Select>
            </FormControl>

            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <IntegrationDownshift params={this.props.params} />
            </div>

            <IconButton
              className={classes.homeButton}
              color="inherit"
              aria-label="Open drawer"
              onClick={() => {
                this.props.history.push("/");
              }}>
              <HomeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </MuiThemeProvider>
    );
  }
}

const styles = theme => ({
  root: {
    width: "100%"
  },
  rootSelect: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  grow: {
    flexGrow: 1
  },
  homeButton: {
    marginLeft: 10,
    marginRight: 10
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 7,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  }
});

export default withRouter(withStyles(styles)(MenuBar));
