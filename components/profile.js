import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

const styles = theme => ({
  app: {
    textAlign: "center",
    padding: "10px"
  },
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    textAlign: "left",
    width: 200
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
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
              value={this.props.city}
              onChange={this.props.handleTextInput("city")}
              margin="normal"
            />
          </div>
          <div>
            <TextField
              id="country"
              label="Country you grew up in"
              className={classes.textField}
              value={this.props.country}
              onChange={this.props.handleTextInput("country")}
              margin="normal"
            />
          </div>

          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-simple">Age</InputLabel>
              <Select
                value={this.props.age}
                onChange={this.props.handleTextInput("age")}
                inputProps={{
                  name: "age",
                  id: "age"
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"13-16"}>13-16</MenuItem>
                <MenuItem value={"17-20"}>17-20</MenuItem>
                <MenuItem value={"21-25"}>21-25</MenuItem>
                <MenuItem value={"26-30"}>26-30</MenuItem>
                <MenuItem value={"31-35"}>31-35</MenuItem>
                <MenuItem value={"36-40"}>36-40</MenuItem>
                <MenuItem value={"41-45"}>41-45</MenuItem>
                <MenuItem value={"46-50"}>46-50</MenuItem>
                <MenuItem value={"51-60"}>51-60</MenuItem>
                <MenuItem value={"60+"}>60+</MenuItem>
              </Select>
            </FormControl>
          </form>
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
            <a
              href="/terms_and_conditions"
              target="_blank"
              rel="noopener noreferrer"
            >
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
  nextSection: PropTypes.func.isRequired,
  country: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  age: PropTypes.string.isRequired
};

export default withStyles(styles)(Profile);
