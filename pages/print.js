import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { withI18next } from "../lib/withI18next";
import { withStyles } from "@material-ui/core/styles";
import { WordMark } from "@cdssnc/gcui";

const styles = () => ({
  root: {
    fontFamily: "Merriweather, serif"
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  bold: {
    fontWeight: "bold"
  },
  rules: {
    width: "100%",
    lineHeight: "1.5em",
    marginTop: "0.5em",
    height: "3em",
    backgroundImage: "linear-gradient(black 1px, transparent 0)",
    backgroundPosition: "0px 1.2em",
    backgroundSize: "100% 1.5em",
    "-webkit-print-color-adjust": "exact"
  }
});

const profile_questions = [
  "patronType",
  "serviceType",
  "statusAndVitals",
  "serviceHealthIssue"
];

export class Print extends Component {
  componentDidMount() {
    window.print();
  }

  countString = (filteredBenefits, benefits, t) => {
    switch (true) {
      case filteredBenefits.length === benefits.length:
        return t("B3.All benefits to consider");
      case filteredBenefits.length === 0:
        return t("B3.No benefits");
      case filteredBenefits.length === 1:
        return t("B3.One benefit");
      default:
        return t("B3.x benefits to consider", { x: filteredBenefits.length });
    }
  };

  sortBenefits = (benefits, language, sortBy) => {
    benefits.forEach(b => {
      if (b.sortingPriority === undefined) {
        b.sortingPriority = "low";
      }
      b.sortingNumber = { high: 1, medium: 2, low: 3 }[b.sortingPriority];
    });

    let sorting_fn = (a, b) => {
      if (sortBy === "alphabetical" || a.sortingNumber === b.sortingNumber) {
        // sort alphabetically
        let vacName = language === "en" ? "vacNameEn" : "vacNameFr";
        let nameA = a[vacName].toUpperCase();
        let nameB = b[vacName].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }
      // ascending numeric sort
      return a.sortingNumber - b.sortingNumber;
    };
    return benefits.sort(sorting_fn);
  };

  render() {
    const { i18n, t, benefits, needs, classes, closestAreaOffice } = this.props; // eslint-disable-line no-unused-vars

    const query = this.props.url.query;
    const filteredBenefitsIDs =
      Object.keys(query).indexOf("benefits") > -1
        ? query.benefits.split(",")
        : [];
    const filteredBenefits = benefits.filter(
      x => filteredBenefitsIDs.indexOf(x.id) > -1
    );
    const sortedFilteredBenefits = this.sortBenefits(
      filteredBenefits,
      this.props.t("current-language-code"),
      query["sortBy"]
    );
    const selectedNeedsIDs =
      Object.keys(query).indexOf("needs") > -1 ? query.needs.split(",") : [];
    const selectedNeeds = needs.filter(
      x => selectedNeedsIDs.indexOf(x.id) > -1
    );

    const profile_text = profile_questions
      .map(k => {
        if (k === "serviceHealthIssue" && query[k] === "true") {
          return t("GE.has service related health issue");
        }
        if (k === "serviceHealthIssue" && query[k] === "false") {
          return t("GE.no service related health issue");
        }
        return t(query[k]);
      })
      .filter(x => (x && x.length > 0 ? true : false))
      .join(", ");

    const needs_text = selectedNeeds
      .map(n => (t("current-language-code") === "en" ? n.nameEn : n.nameFr))
      .join(", ");

    return (
      <div style={{ padding: 12 }} className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <img
              src={
                t("current-language-code") == "en"
                  ? "../static/vac-sig-eng-2018.svg"
                  : "../static/vac-sig-fra-2018.svg"
              }
              alt="VAC Logo"
              style={{ width: "400px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <div className={classes.title}>{t("favourites.contact_us")}</div>
            <div className={classes.bold}>{t("contact.phone")}</div>
            <div>{t("favourites.call_time")}</div>
            <br />
            <div className={classes.bold}>{t("contact.email")}</div>
            <div>{t("favourites.email_disclaimer")}</div>
          </Grid>
          <Grid item xs={6} id="closest_office_info">
            <div className={classes.title}>{t("print.closest_office")}</div>
            <div className={classes.rules} style={{ height: "5em" }}>
              {t("current-language-code") == "en"
                ? closestAreaOffice.name_en
                : closestAreaOffice.name_fr}
              <br />
              {t("current-language-code") == "en"
                ? closestAreaOffice.address_en
                : closestAreaOffice.address_fr}
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.title}>{t("favourites.apply_prompt")}</div>
            <div className={classes.bold}>{t("contact.my_vac_link")}</div>
            <div>{t("print.sign_up_for_my_vac")}</div>
          </Grid>

          <Grid item xs={12}>
            <div
              style={{
                borderStyle: "solid",
                borderWidth: "1px",
                padding: "1.5em"
              }}
            >
              <div className={classes.title}>
                {t("print.fill_out_profile_needs_prompt")}
              </div>

              <div className="profile_section" style={{ marginBottom: "1em" }}>
                <div className={classes.bold}>
                  {t("print.who_is_receiving")}
                </div>
                <div className={classes.rules}>{profile_text}</div>
              </div>

              <div className="needs_section">
                <div className={classes.bold}>{t("print.what_needs")}</div>
                <div className={classes.rules}>{needs_text}</div>
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="title">
              {this.countString(sortedFilteredBenefits, benefits, t)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {sortedFilteredBenefits.map((b, i) => {
              return (
                <div
                  key={i}
                  style={{ marginBottom: "15px" }}
                  className="benefitsListItem"
                >
                  <div>
                    <b>
                      {t("current-language-code") == "en"
                        ? b.vacNameEn
                        : b.vacNameFr}
                    </b>
                  </div>
                  <div>
                    {t("current-language-code") == "en"
                      ? b.oneLineDescriptionEn
                      : b.oneLineDescriptionFr}
                  </div>
                </div>
              );
            })}
          </Grid>
          <Grid item xs={12} style={{ textAlign: "right" }}>
            <WordMark width="6em" flag="#000" />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = reduxState => {
  return {
    benefits: reduxState.benefits,
    examples: reduxState.examples,
    eligibilityPaths: reduxState.eligibilityPaths,
    needs: reduxState.needs,
    closestAreaOffice: reduxState.closestAreaOffice
  };
};

Print.propTypes = {
  benefits: PropTypes.array.isRequired,
  examples: PropTypes.array.isRequired,
  needs: PropTypes.array.isRequired,
  eligibilityPaths: PropTypes.array.isRequired,
  closestAreaOffice: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  url: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(
  withI18next()(withStyles(styles)(Print))
);
