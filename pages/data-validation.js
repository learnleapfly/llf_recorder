import React, { Component } from "react";
import PropTypes from "prop-types";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

import { withI18next } from "../lib/withI18next";
import Layout from "../components/layout";
import { connect } from "react-redux";

const styles = theme => ({
  root: {
    maxWidth: "1200px",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "0 auto"
  },
  table: {
    width: 500
  }
});

export class DataValidation extends Component {
  createData = (name, value, status) => {
    return { name, value, status };
  };

  checkBenefitsFields(b, i) {
    if (
      !(b.vacNameEn && b.vacNameEn != "") ||
      !(b.vacNameFr && b.vacNameFr != "") ||
      !(b.oneLineDescriptionEn && b.oneLineDescriptionEn != "") ||
      !(b.oneLineDescriptionFr && b.oneLineDescriptionFr != "") ||
      !(b.benefitPageEn && b.benefitPageEn != "") ||
      !(b.benefitPageFr && b.benefitPageFr != "")
    ) {
      return " " + b.id + " (" + (i + 1) + "),";
    }
  }

  checkAreaOfficesFields(a, i) {
    if (
      !(a.address_en && a.address_en != "") ||
      !(a.address_fr && a.address_fr != "") ||
      !(a.lat && a.lat != "") ||
      !(a.lng && a.lng != "") ||
      !(a.name_en && a.name_en != "") ||
      !(a.name_fr && a.name_fr != "")
    ) {
      return " " + a.id + " (" + (i + 1) + "),";
    }
  }

  checkTranslationsFields(t, i) {
    if (
      !(t.key && t.key != "") ||
      !(t.English && t.English != "") ||
      !(t.French && t.French != "")
    ) {
      return " " + t.id + " (" + (i + 1) + "),";
    }
  }

  checkMissingNeeds(b, i) {
    if (!(b.needs && b.needs != "")) {
      return " " + b.id + " (" + (i + 1) + "),";
    }
  }

  checkEligibiltyPaths(b, i) {
    if (!(b.eligibilityPaths && b.eligibilityPaths != "")) {
      return " " + b.id + " (" + (i + 1) + "),";
    }
  }

  render() {
    const {
      i18n,
      t,
      classes,
      benefits,
      eligibilityPaths,
      needs,
      examples,
      translations,
      areaOffices
    } = this.props; // eslint-disable-line no-unused-vars

    const data = [
      this.createData(
        "Size of Benefits Table",
        benefits.length,
        benefits.length > 0 ? "Pass" : "Fail"
      ),
      this.createData(
        "Size of Eligibility Paths Table",
        eligibilityPaths.length,
        eligibilityPaths.length > 0 ? "Pass" : "Fail"
      ),
      this.createData(
        "Size of Needs Table",
        needs.length,
        needs.length > 0 ? "Pass" : "Fail"
      ),
      this.createData(
        "Size of Examples Table",
        examples.length,
        examples.length > 0 ? "Pass" : "Fail"
      ),
      this.createData(
        "nameTranslationTableSize",
        translations.length,
        translations.length > 0 ? "Pass" : "Fail"
      ),
      this.createData(
        "nameAreaOfficesSize",
        areaOffices.length,
        areaOffices.length > 0 ? "Pass" : "Fail"
      ),
      this.createData(
        "Benefits with Empty Fields",
        benefits.map(this.checkBenefitsFields),
        benefits.filter(this.checkBenefitsFields).length == 0 ? "Pass" : "Fail"
      ),
      this.createData(
        "Benefits Without Needs",
        benefits.map(this.checkMissingNeeds),
        benefits.filter(this.checkMissingNeeds).length == 0 ? "Pass" : "Fail"
      ),
      this.createData(
        "Benefits not in an Eligibility Path",
        benefits.map(this.checkEligibiltyPaths),
        benefits.filter(this.checkEligibiltyPaths).length == 0 ? "Pass" : "Fail"
      ),
      this.createData(
        "emptyAreaOffices",
        areaOffices.map(this.checkAreaOfficesFields),
        areaOffices.filter(this.checkAreaOfficesFields).length == 0
          ? "Pass"
          : "Fail"
      ),
      this.createData(
        "emptyTranslations",
        translations.map(this.checkTranslationsFields),
        translations.filter(this.checkTranslationsFields).length == 0
          ? "Pass"
          : "Fail"
      )
    ];

    return (
      <Layout
        title={t("dv.pageTitle")}
        i18n={i18n}
        t={t}
        hideNoscript={true}
        showRefreshCache={true}
      >
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{t("dv.name")}</TableCell>
                <TableCell>{t("dv.value")}</TableCell>
                <TableCell>{t("dv.status")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((n, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{t("dv." + n.name)}</TableCell>
                    <TableCell>{n.value}</TableCell>
                    <TableCell>{t("dv." + n.status)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    benefits: state.benefits,
    eligibilityPaths: state.eligibilityPaths,
    needs: state.needs,
    examples: state.examples,
    translations: state.translations,
    areaOffices: state.areaOffices
  };
};

DataValidation.propTypes = {
  benefits: PropTypes.array.isRequired,
  eligibilityPaths: PropTypes.array.isRequired,
  needs: PropTypes.array.isRequired,
  examples: PropTypes.array.isRequired,
  i18n: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  translations: PropTypes.array.isRequired,
  areaOffices: PropTypes.array.isRequired
};

export default withStyles(styles)(
  connect(mapStateToProps)(withI18next()(DataValidation))
);
