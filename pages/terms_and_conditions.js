import React, { Component } from "react";
import styled from "react-emotion";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Head from "../components/head";

const Container = styled("div")`
  max-width: 800px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
`;

const styles = theme => ({
  root: {
    textAlign: "center"
  },
  body: {
    display: "inline-block",
    marginBottom: "50px"
  },
  title: {
    marginBottom: 2 * theme.spacing.unit,
    marginTop: 2 * theme.spacing.unit
  },
  pageTitle: {
    marginBottom: 2 * theme.spacing.unit,
    marginTop: 2 * theme.spacing.unit,
    textAlign: "center"
  },
  contactBlock: {
    margin: 2 * theme.spacing.unit
  }
});

class TC extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container>
        <div className={classes.body}>
          <Head title="Kasuku Recorder Terms and Conditions" />

          <Typography variant="display1" className={classes.pageTitle}>
            Terms and Conditions
          </Typography>

          <Typography variant="headline" className={classes.title}>
            Purpose
          </Typography>
          <Typography variant="subheading">
            The purpose of this site is to collect audio and anonymous
            demographic data for the purposes of building a speech dataset for
            Artificial Intelligence (AI) experimentation.
          </Typography>

          <Typography variant="headline" className={classes.title}>
            Consent
          </Typography>
          <Typography variant="subheading">
            By using this site, you agree to the collection, use, and eventual
            distribution of your voluntarily-submitted data as an anonymized
            dataset.
          </Typography>

          <Typography variant="headline" className={classes.title}>
            Types of Data Collection
          </Typography>

          <Typography variant="title" className={classes.title}>
            Voluntarily-Submitted Data
          </Typography>
          <Typography variant="subheading">
            The purpose of this service is to collect audio and anonymous
            demographic data for use as a speech dataset for Artificial
            Intelligence (AI) experimentation. We strive to maintain the
            anonymity of this collected data, and take steps to ensure that any
            data collected in this fashion is stored separately from potentially
            identifying information (see Metadata and email addresses, below).
            Voluntarily-Submitted data consist of audio samples and optional,
            anonymous demographic information about the speaker.
          </Typography>

          <Typography variant="title" className={classes.title}>
            Metadata
          </Typography>
          <Typography variant="subheading">
            When you use this service, we may automatically collect and store
            certain information about your computer or device and your
            activities including:
            <ul>
              <li>the IP address of your computer;</li>
              <li>the unique mobile device identifier;</li>
              <li>
                {" "}
                technical information about your computer or mobile device such
                as they type of device, mobile device identification number, web
                browser, other browser information (e.g. size, connection speed
                and connection type), and operating system or platform;
              </li>
              <li>
                your preferences and settings (time zone, language, etc.); and
              </li>
              <li>your internet provider or mobile carrier name.</li>
            </ul>
            This type of information is usually transmitted automatically as
            part of communications between your device and our web server. We
            store this information for a limited amount of time in order to
            ensure the proper functioning of our systems, and to generate
            anonymized usage statistics. These logs are purged on a regular
            basis.
          </Typography>

          <Typography variant="title" className={classes.title}>
            Email Addresses
          </Typography>
          <Typography variant="subheading">
            You may supply us with an optional email address if you wish to
            receive information about updates to this service. Your email
            address is stored separately from collected audio and metadata
            information and used only for the purpose of contacting you with
            updates. You may unsubscribe from this update list at any time, and
            for any reason.
          </Typography>

          <Typography variant="headline" className={classes.title}>
            Security and Privacy
          </Typography>
          <Typography variant="subheading">
            We take your privacy very seriously. We restrict unauthorized access
            to collected data through protective policies, procedures, and
            technical measures, including:
            <ul>
              <li>
                {" "}
                providing reasonable physical and electronic safeguards with
                regard to the storage of Personal Information;
              </li>
              <li>
                {" "}
                limiting access to your personal Information to those employees
                or contractors who we reasonably believe
              </li>
              need to come into contact with that information to provide
              products or services to you or in order to do their jobs; and
              <li>
                {" "}
                governing employees and other contractors by strict standards
                and policies to ensure that Personal Information is secure and
                treated with the utmost care and respect
              </li>
            </ul>
            Please note that no data transmission over the internet or otherwise
            can be guaranteed to be completely secure. As a result, while we
            strive to protect your Personal Information, we cannot warrant the
            security of any information you transmit to us, and you do so at
            your own risk. If you have a security related concern, please
            contact us at the contact details provided below. We will work
            closely with you to ensure a quick and personal response to your
            concerns.
          </Typography>

          <Typography variant="headline" className={classes.title}>
            Contact Us
          </Typography>
          <Typography variant="subheading">
            Should you have any question about this service, please contact:
            <div className={classes.contactBlock}>
              <div>Learn Leap Fly</div>
              <div>contact.us@learnleapfly.com</div>
              <div>123 Slater St, 6th Floor, Ottawa, ON K1P 5H2</div>
            </div>
          </Typography>
        </div>
      </Container>
    );
  }
}

TC.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TC);
