import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

require("isomorphic-fetch");
const uuid = require("uuid");
import Head from "../components/head";
import Profile from "../components/profile";
import RecordAudio from "../components/recordAudio";
import NoMic from "../components/no_mic";
import Finished from "../components/finished";

const styles = theme => ({
  app: {
    textAlign: "center",
    padding: "10px"
  },
  title: {
    marginBottom: 4 * theme.spacing.unit
  }
});

class App extends Component {
  state = {
    id: uuid.v4().substring(0, 8),
    section: "profile",
    country: "",
    city: "",
    age: "",
    email: ""
  };

  handleTextInput = field => event => {
    this.setState({
      [field]: event.target.value
    });
  };

  uploadAudio = (sentence, sentenceIndex, blob) => {
    let fd = new FormData();
    fd.append("audio", blob);
    fd.append("sentence", sentence);
    fd.append("sentenceIndex", sentenceIndex);
    fd.append("country", this.state.country);
    fd.append("city", this.state.city);
    fd.append("age", this.state.age);
    fd.append("id", this.state.id);
    fd.append("date", new Date().toUTCString());
    fetch("/submitData", {
      headers: { Accept: "application/json" },
      method: "POST",
      body: fd
    }).then(result => {
      console.log("audio fetch result:", result); // eslint-disable-line no-console
    });
  };

  uploadEmail = email => {
    let fd = new FormData();
    fd.append("id", uuid.v4().substring(0, 7));
    fd.append("audio", null);
    fd.append("email", email);
    fetch("/submitData", {
      headers: { Accept: "application/json" },
      method: "POST",
      body: fd
    }).then(result => {
      console.log("email fetch result:", result); // eslint-disable-line no-console
    });
  };

  sectionToDisplay = section => {
    switch (section) {
      case "profile":
        return (
          <Profile
            nextSection={() => this.setState({ section: "recorder" })}
            handleTextInput={this.handleTextInput}
            country={this.state.country}
            city={this.state.city}
            age={this.state.age}
          />
        );
      case "recorder":
        return (
          <RecordAudio
            nextSection={() => this.setState({ section: "finished" })}
            noMic={() => this.setState({ section: "no-mic" })}
            uploadAudio={this.uploadAudio}
          />
        );
      case "no-mic":
        return <NoMic nextSection={() => (window.location.href = "/")} />;
      case "finished":
        return <Finished uploadEmail={this.uploadEmail} />;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.app}>
        <Head title="Kasuku Recorder" />
        {this.sectionToDisplay(this.state.section)}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
