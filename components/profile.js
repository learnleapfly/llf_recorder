import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  app: {
    textAlign: "center",
    padding: "10px"
  },
  title: {
    marginBottom: 4 * theme.spacing.unit
  },
  textFieldContainer: {
    marginBottom: 8 * theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  button: {
    textTransform: "none",
    margin: theme.spacing.unit,
    marginBottom: 4 * theme.spacing.unit
  }
});

class Profile extends Component {
  state = {
    termsChecked: false
  };

  handleTermsChecked = () => {
    this.setState({ termsChecked: !this.state.termsChecked });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.app}>
        <Typography variant="headline" className={classes.title}>
          Help us learn to guess your accent and age!
        </Typography>

        <div className={classes.textFieldContainer}>
          <div>
            <TextField
              id="city"
              label="City you grew up in"
              className={classes.textField}
              value={this.state.city}
              onChange={this.props.handleTextInput("city")}
              margin="normal"
            />
          </div>
          <div>
            <TextField
              id="country"
              label="Country you grew up in"
              className={classes.textField}
              value={this.state.country}
              onChange={this.props.handleTextInput("country")}
              margin="normal"
            />
          </div>
          <div>
            <TextField
              id="age"
              label="Current Age"
              className={classes.textField}
              value={this.state.age}
              onChange={this.props.handleTextInput("age")}
              margin="normal"
            />
          </div>
        </div>
        <div>
          <Typography variant="title">
            <Checkbox
              checked={this.state.termsChecked}
              onChange={this.handleTermsChecked}
              value="checked"
              color="primary"
            />
            {"I agree to the "}
            <a href="/" target="_blank" rel="noopener noreferrer">
              Terms and Conditions
            </a>
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.props.nextSection}
          disabled={!this.state.termsChecked}
        >
          Submit
        </Button>
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  handleTextInput: PropTypes.func.isRequired,
  nextSection: PropTypes.func.isRequired
};

export default withStyles(styles)(Profile);
