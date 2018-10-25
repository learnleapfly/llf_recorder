import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { KeyboardArrowRight } from "@material-ui/icons";
import Recorder from "recorder-js";

const isBrowser = typeof window !== "undefined";

const getAudioContext = isBrowser => {
  if (isBrowser) {
    if (window.AudioContext) {
      return new window.AudioContext();
    } else if (window.webkitAudioContext) {
      return new window.webkitAudioContext();
    }
  }
  return undefined;
};

const audioContext = getAudioContext(isBrowser);

const recorder = new Recorder(audioContext, {});

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
  recordingLine: {
    margin: theme.spacing.unit
  }
});

class RecordAudio extends Component {
  state = {
    sentences: this.props.data,
    sentenceIndex: 0,
    blob: null,
    isRecording: false
  };

  componentDidMount = () => {
    this.createRecordingStream();
  };

  createRecordingStream = () => {
    if (isBrowser) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => recorder.init(stream))
        .catch(err => {
          console.log("Uh oh... unable to get stream...", err); // eslint-disable-line no-console
          this.props.noMic();
        });
    }
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
        return "Next";
      case this.state.isRecording:
        return "Stop";
      default:
        return "Record";
    }
  };

  handleButtonPress = () => {
    switch (this.buttonValue()) {
      case "Next":
        return this.handleNextButton();
      case "Stop":
        return this.stopRecording();
      case "Record":
        return this.startRecording();
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

  handleNextButton = () => {
    this.upload();
    if (this.state.sentenceIndex === this.state.sentences.length - 1) {
      recorder.stream.getAudioTracks().forEach(function(track) {
        track.stop();
      });
      this.props.nextSection();
    } else {
      this.addToIndex(1);
      this.startRecording();
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
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.startRecording}
            disabled={this.state.blob === null}
          >
            Record Again
          </Button>

          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.handleButtonPress}
            style={{
              backgroundColor: this.state.isRecording ? "green" : "red"
            }}
          >
            {this.buttonValue()}
            {this.buttonValue() === "Next" ? <KeyboardArrowRight /> : ""}
          </Button>
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
  nextSection: PropTypes.func.isRequired,
  noMic: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};

export default withStyles(styles)(RecordAudio);
