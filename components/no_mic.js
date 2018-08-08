import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
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

class NoMic extends Component {
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
          Cannot turn on microphone
        </Typography>

        <Typography variant="title" className={classes.title}>
          <div>{"I'm sorry, I can't turn on your microphone."}</div>
          <div>Please make sure that your device has one,</div>
          <div>
            {"and that you haven't blocked this website from accessing it."}
          </div>
        </Typography>

        <Typography variant="title" className={classes.title}>
          <div>{"If that's all ok then it's probably our fault."}</div>
          <div>{"It'd be great if you could email us at"}</div>
          <div style={{ margin: "10px" }}>{"contact.us@learnleapfly.com"}</div>
          <div>
            With your device / operating system / browser details. Thanks!
          </div>
        </Typography>

        <Button
          onClick={() => this.props.nextSection()}
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Try Again
        </Button>
      </div>
    );
  }
}

NoMic.propTypes = {
  classes: PropTypes.object.isRequired,
  nextSection: PropTypes.func.isRequired
};

export default withStyles(styles)(NoMic);
