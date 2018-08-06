import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import green from "@material-ui/core/colors/green";
import Recorder from "recorder-js";

const isBrowser = typeof window !== "undefined";

const audioContext = isBrowser
  ? new (window.AudioContext || window.webkitAudioContext)()
  : undefined;

const recorder = new Recorder(audioContext, {});

const createRecordingStream = () => {
  if (isBrowser) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => recorder.init(stream))
      .catch(err => console.log("Uh oh... unable to get stream...", err)); // eslint-disable-line no-console
  }
};

const styles = theme => ({
  app: {
    textAlign: "center",
    padding: "10px"
  },
  title: {
    marginBottom: 6 * theme.spacing.unit
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
  nextButton: {
    textTransform: "none",
    margin: theme.spacing.unit,
    marginBottom: 4 * theme.spacing.unit,
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700]
    },
    "&:disabled": {
      backgroundColor: "#fff"
    }
  },

  recordingLine: {
    margin: theme.spacing.unit
  }
});

class RecordAudio extends Component {
  state = {
    sentences: ["Go attack the germs!!", "This is Khalai."],
    sentenceIndex: 0,
    blob: null,
    isRecording: false
  };

  componentDidMount = () => {
    createRecordingStream();
  };

  startRecording = () => {
    recorder.start().then(() => {
      this.setState({ blob: null, isRecording: true });
    });
  };

  stopRecording = () => {
    if (this.state.isRecording) {
      recorder.stop().then(({ blob }) => {
        this.setState({ blob: blob, isRecording: false });
      });
    }
  };

  clearRecording = () => {
    this.setState({ blob: null });
  };

  upload = () => {
    this.props.uploadAudio(
      this.state.sentences[this.state.sentenceIndex],
      this.state.sentenceIndex,
      this.state.blob
    );
  };

  addToIndex = increment => {
    this.setState({
      sentenceIndex:
        (this.state.sentenceIndex + increment + this.state.sentences.length) %
        this.state.sentences.length
    });
    this.clearRecording();
  };

  buttonValue = () => {
    switch (true) {
      case this.state.blob != null:
        return "Record Again";
      case this.state.isRecording:
        return "Stop";
      default:
        return "Record";
    }
  };

  handleButtonPress = () => {
    switch (this.buttonValue()) {
      case "Stop":
        this.stopRecording();
        break;
      default:
        this.startRecording();
    }
  };

  recordingMessage = () => {
    switch (true) {
      case this.buttonValue() === "Record":
        return "Press Record to begin";
      case this.buttonValue() === "Stop":
        return "Recording... Press Stop to end";
      case this.state.sentenceIndex < this.state.sentences.length - 1:
        return "Done recording! Go to Next page or re-record this page.";
      default:
        return "Done recording! Re-record or press Next to finish";
    }
  };

  handlePreviousButton = () => {
    this.addToIndex(-1);
  };

  handleNextButton = () => {
    this.upload();
    if (this.state.sentenceIndex === this.state.sentences.length - 1) {
      recorder.stream.getAudioTracks().forEach(function(track) {
        track.stop();
      });
      this.props.nextSection();
    } else {
      this.addToIndex(1);
    }
  };

  render() {
    const { classes } = this.props;
    const sentence = this.state.sentences[this.state.sentenceIndex];

    return (
      <div className={classes.app}>
        <Typography variant="headline" className={classes.title}>
          Read a short story
        </Typography>

        <Typography variant="title" className={classes.sentence}>
          {sentence}
        </Typography>

        <div className={classes.navigationButtonContainer}>
          <IconButton
            className={classes.button}
            onClick={this.handlePreviousButton}
            disabled={this.state.sentenceIndex === 0}
          >
            <KeyboardArrowLeft />
          </IconButton>

          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={this.handleButtonPress}
          >
            {this.buttonValue()}
          </Button>

          <IconButton
            className={classes.nextButton}
            onClick={this.handleNextButton}
            disabled={this.state.blob === null}
          >
            <KeyboardArrowRight />
          </IconButton>
        </div>

        <div className={classes.recordingLine}>{this.recordingMessage()}</div>

        {this.state.blob ? (
          <div>
            <audio controls={true} src={URL.createObjectURL(this.state.blob)} />
          </div>
        ) : (
          ""
        )}

        <div style={{ marginTop: "50px" }}>
          Page {this.state.sentenceIndex + 1} / {this.state.sentences.length}
        </div>
      </div>
    );
  }
}

RecordAudio.propTypes = {
  classes: PropTypes.object.isRequired,
  uploadAudio: PropTypes.func.isRequired,
  nextSection: PropTypes.func.isRequired
};

export default withStyles(styles)(RecordAudio);
