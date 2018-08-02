const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const next = require("next");
const helmet = require("helmet");

const { parseUserAgent } = require("detect-browser");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());
  server.use(helmet());

  // const storage = multer.memoryStorage()
  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "/tmp/my-uploads");
    },
    filename: function(req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    }
  });
  const upload = multer({ storage: storage });

  server.post("/submitBlob", upload.single("audio"), function(req, res, next) {
    console.log("Submitting blob multer");
    console.log("file", req.file);
    console.log("body", req.body);
    res.sendStatus(200);
  });

  server.get("*", (req, res) => {
    // Check if browse is less than IE 11
    const ua = req.headers["user-agent"];
    const browser = parseUserAgent(ua);

    handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, err => {
    if (err) throw err;
    console.log("> Ready on http://localhost:" + port);
  });
});
