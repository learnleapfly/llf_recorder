require("isomorphic-fetch");

var WEBHOOK_URL = process.env.WEBHOOK_URL;
var ENV = process.env.NODE_ENV || "development";
var NAME = process.env.CIRCLE_PROJECT_REPONAME;
var BRANCH = process.env.CIRCLE_BRANCH;
var COMMIT = process.env.CIRCLE_SHA1
  ? process.env.CIRCLE_SHA1.substring(0, 7)
  : "unkown commit";
var SOURCE_URL = process.env.CIRCLE_REPOSITORY_URL;
var URL;

if (SOURCE_URL) {
  URL =
    "https://" +
    SOURCE_URL.split("@")[1]
      .replace(":", "/")
      .replace(".git", "");
}

var COMMIT_URL = URL + "/commit/" + COMMIT;
var COLOR;

if (process.env.CIRCLECI == "true") {
  ENV = "test";
}

switch (ENV.toLowerCase()) {
  case "production":
    COLOR = "#2eb886";
    break;
  case "test":
    COLOR = "#4682b4";
    break;
  default:
    COLOR = "#dccdc";
}

var fallback =
  "[" +
  Date().toString() +
  "] Deployed " +
  NAME +
  " (" +
  BRANCH +
  "/" +
  COMMIT +
  ") in " +
  ENV +
  " | " +
  COMMIT_URL;

var notify = (exports.notify = function notify() {
  if (
    typeof WEBHOOK_URL != "undefined" &&
    WEBHOOK_URL != "" &&
    WEBHOOK_URL != null
  ) {
    fetch("https://api.ipify.org/?format=json")
      .then(function(resp) {
        return resp.json();
      })
      .then(function(json) {
        var data = {
          attachments: [
            {
              fallback: fallback,
              color: COLOR,
              author_name: NAME,
              title: "Deployed to " + ENV,
              title_link: COMMIT_URL,
              fields: [
                {
                  title: "Branch",
                  value: BRANCH,
                  short: true
                },
                {
                  title: "Commit",
                  value: COMMIT,
                  short: true
                }
              ],
              footer: json.ip,
              ts: Math.round(new Date().getTime() / 1000)
            }
          ]
        };
        fetch(WEBHOOK_URL, {
          body: JSON.stringify(data),
          cache: "no-cache",
          headers: {
            "content-type": "application/json"
          },
          method: "POST",
          mode: "cors"
        });
      });
  }
});
