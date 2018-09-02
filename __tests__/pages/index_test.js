/* eslint-env jest */

import { mount } from "enzyme";
import React from "react";
import { IndexPage } from "../../pages/index";

describe("Index page", () => {
  let props;

  beforeEach(() => {
    props = {
      classes: {}
    };
  });

  it("has a title", () => {
    const appMounted = mount(<IndexPage {...props} />);
    expect(
      appMounted
        .find("h1")
        .first()
        .text()
    ).toEqual("Help us learn to guess your accent and age!");
  });
});
