import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Recorder from "recorder-js";
require("isomorphic-fetch");

const isBrowser = typeof window !== "undefined";

const audioContext = isBrowser
  ? new (window.AudioContext || window.webkitAudioContext)()
  : undefined;

const recorder = new Recorder(audioContext, {
  // An array of 255 Numbers
  // You can use this to visualize the audio stream
  // If you use react, check out react-wave-stream
  // onAnalysed: data => console.log(data),
});

const createRecordingStream = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(stream => recorder.init(stream))
    .catch(err => console.log("Uh oh... unable to get stream...", err));
};

if (isBrowser) {
  createRecordingStream();
}

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
  sentence: {
    margin: 2 * theme.spacing.unit
  },
  navigationButtonContainer: {
    margin: theme.spacing.unit
  },
  button: {
    textTransform: "none",
    margin: theme.spacing.unit,
    marginBottom: 4 * theme.spacing.unit
  },
  recordingLine: {
    margin: theme.spacing.unit
  }
});

class App extends Component {
  state = {
    audioStreamCreated: true,
    sentences: ["Go attack the germs!!", "This is Khalai."],
    sentenceIndex: 0,
    blob: null,
    isRecording: false,

    country: "",
    city: "",
    age: ""
  };

  startRecording = () => {
    recorder.start().then(() => {
      this.setState({ blob: null, isRecording: true });
    });
  };

  stopRecording = () => {
    if (this.state.isRecording) {
      recorder.stop().then(({ blob, buffer }) => {
        this.setState({ blob: blob, isRecording: false });
        // buffer is an AudioBuffer
      });
    }
  };

  upload = () => {
    let fd = new FormData();
    fd.append("audio", this.state.blob);
    fd.append("sentence", this.state.sentences[this.state.sentenceIndex]);
    fd.append("country", this.state.country);
    fd.append("city", this.state.city);
    fd.append("age", this.state.age);
    fd.append("date", new Date().toUTCString());
    fetch("/submitBlob", {
      headers: { Accept: "application/json" },
      method: "POST",
      body: fd
    });
  };

  clearRecording = () => {
    this.setState({ blob: null });
  };

  addToIndex = increment => {
    this.setState({
      sentenceIndex:
        (this.state.sentenceIndex + increment + this.state.sentences.length) %
        this.state.sentences.length
    });
  };

  handleTextInput = field => event => {
    this.setState({
      [field]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const sentence = this.state.sentences[this.state.sentenceIndex];

    return (
      <div className={classes.app}>
        <Typography variant="display1" className={classes.title}>
          Sentence Recorder
        </Typography>

        <div className={classes.textFieldContainer}>
          <TextField
            id="country"
            label="Country you grew up in"
            className={classes.textField}
            value={this.state.country}
            onChange={this.handleTextInput("country")}
            margin="normal"
          />
          <TextField
            id="city"
            label="City you grew up in"
            className={classes.textField}
            value={this.state.city}
            onChange={this.handleTextInput("city")}
            margin="normal"
          />
          <TextField
            id="age"
            label="Current Age"
            className={classes.textField}
            value={this.state.age}
            onChange={this.handleTextInput("age")}
            margin="normal"
          />
        </div>

        <Typography variant="title" className={classes.sentence}>
          {sentence}
        </Typography>

        <div className={classes.navigationButtonContainer}>
          <Button
            className={classes.button}
            onClick={() => this.addToIndex(-1)}
          >
            Previous
          </Button>
          <Button className={classes.button} onClick={() => this.addToIndex(1)}>
            Next
          </Button>
        </div>

        <div className={classes.recordingLine}>
          Recording: {this.state.isRecording ? "Recording" : "Not Recording"}
        </div>

        <div>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={this.startRecording}
          >
            Record
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.stopRecording}
          >
            Stop
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.clearRecording}
          >
            Clear
          </Button>
        </div>

        {this.state.blob ? (
          <div>
            <audio controls={true} src={URL.createObjectURL(this.state.blob)} />
            <Button className={classes.button} onClick={this.upload}>
              Upload
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(App);
