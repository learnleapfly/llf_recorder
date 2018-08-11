import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Head from "../components/head";
const styles = theme => ({
  app: {
    textAlign: "center",
    padding: "10px"
  },
  title: {
    marginBottom: 4 * theme.spacing.unit
  }
});

class TC extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.app}>
        <Head title="Kasuku Recorder Terms and Conditions" />

        <Typography variant="headline" className={classes.title}>
          Terms and Conditions
        </Typography>
        <Typography variant="title">
          Kjell needs to provide the terms and conditions :(
        </Typography>
      </div>
    );
  }
}

TC.propTypes = {
  classes: PropTypes.object.isRequired,
  nextSection: PropTypes.func.isRequired
};

export default withStyles(styles)(TC);
