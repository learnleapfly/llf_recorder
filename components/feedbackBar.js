import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core/";
import styled from "react-emotion";
import { logEvent } from "../utils/analytics";
import Raven from "raven-js";
import TextField from "@material-ui/core/TextField";
require("isomorphic-fetch");

const CommentBox = styled("div")`
  height: 350px;
  background-color: #eee;
  color: #000;
  text-align: left;
  font-size: 18px;
  padding: 5px 0 0 15px;
  border-bottom: 1px solid #ddd;
`;

const Div = styled("div")`
  width: 100%;
  height: 70px;
  color: #000;
  text-align: left;
  font-size: 18px;
  padding-top: 5px;
  display: table;
  @media (max-width: 400px) {
    height: 100px;
  }
`;

const Inner = styled("div")`
  color: #000;
  text-align: left;
  font-size: 18px;
  float: left;
  padding-left: 15px;
  padding-top: 10px;
  @media (max-width: 400px) {
    font-size: 16px;
    button {
      margin-top: 10px;
    }
  }
`;

const TextHold = styled("div")`
  background-color: #f5f5f5;
  padding: 10px;
  width: 400px;
`;

export class FeedbackBar extends Component {
  state = {
    action: "",
    commentFormToggled: false,
    commentSubmitted: false,
    failure: "",
    feedbackSubmitted: false
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  sendComment = () => {
    this.setState({ commentFormToggled: false });
    this.setState({ commentSubmitted: true });
    let payload = {
      whatWereYouDoing: this.state.action,
      whatWentWrong: this.state.failure,
      url: window.location.href,
      time: new Date().toUTCString()
    };

    fetch("/submitComment", {
      body: JSON.stringify(payload),
      cache: "no-cache",
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    }).catch(err => Raven.captureException(err));
  };

  sendFeedback = answer => {
    this.setState({ feedbackSubmitted: true });
    logEvent("Page Feedback (" + this.props.t("feedback-prompt") + ")", answer);
    if (answer == "No") {
      this.setState({ commentFormToggled: true });
    }
  };

  toggleCommentForm = () => {
    this.setState({ commentFormToggled: !this.state.commentFormToggled });
  };

  render() {
    const { t } = this.props;

    return (
      <div role="navigation">
        {this.state.commentFormToggled ? (
          <CommentBox>
            <h2>{t("comment-help-us-improve")}</h2>
            <p>{t("comment-privacy-disclaimer")}</p>
            <TextHold>
              <TextField
                id="commentWhatWereYouDoing"
                label={t("comment-what-were-you-doing")}
                margin="normal"
                fullWidth={true}
                onChange={this.handleChange("action")}
                value={this.state.action}
                autoFocus
              />
              <TextField
                id="commentWhatWentWrong"
                label={t("comment-what-went-wrong")}
                margin="normal"
                fullWidth={true}
                onChange={this.handleChange("failure")}
                value={this.state.failure}
              />
            </TextHold>
            <br />
            <Button
              id="sendComment"
              variant="raised"
              style={{ textTransform: "none" }}
              color="primary"
              onClick={() => this.sendComment()}
            >
              {t("send")}
            </Button>
          </CommentBox>
        ) : null}
        <Div>
          {this.state.feedbackSubmitted ? (
            <Inner>
              <p>{t("feedback-response")}</p>
            </Inner>
          ) : (
            <Inner>
              {t("feedback-prompt")} &nbsp;
              <Button
                variant="raised"
                style={{ textTransform: "none" }}
                id="feedbackYes"
                onClick={() => this.sendFeedback("Yes")}
              >
                {t("yes")}
              </Button>
              &nbsp; &nbsp;
              <Button
                variant="raised"
                style={{ textTransform: "none" }}
                id="feedbackNo"
                onClick={() => this.sendFeedback("No")}
              >
                {t("no")}
              </Button>
            </Inner>
          )}
        </Div>
      </div>
    );
  }
}

FeedbackBar.propTypes = {
  t: PropTypes.func.isRequired
};

export default FeedbackBar;
