const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const next = require("next");
const helmet = require("helmet");
const AWS = require("aws-sdk");
const bluebird = require("bluebird");
const sslRedirect = require("heroku-ssl-redirect");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// configure the keys for accessing AWS
AWS.config.update({
  region: "us-west-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, key, mimeType) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    ACL: "private",
    Body: buffer,
    Key: key,
    ContentType: mimeType
  };
  return s3.upload(params).promise();
};

app.prepare().then(() => {
  const server = express();
  server.use(sslRedirect());
  server.use(bodyParser.json());
  server.use(helmet());

  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  server.post("/submitData", upload.single("audio"), async function(
    req,
    res,
    next
  ) {
    let fileName = process.env.DEBUG + "recorder_" + req.body.id;
    if (req.body.email !== undefined) {
      fileName = fileName + "_email";
    } else if (req.file !== undefined) {
      fileName = fileName + "_audio_" + req.body.sentenceIndex;
    }

    if (process.env.DEBUG === "local_") {
      console.log("uploading", new Date().toUTCString(), fileName);
      console.log("body:", req.body);
    }
    if (req.file !== undefined) {
      try {
        await uploadFile(req.file.buffer, fileName + ".wav", "audio/x-wav");
      } catch (error) {
        console.log("Error uploading wav!! ", error);
        return res.status(400).send(error);
      }
      if (process.env.DEBUG === "local_") {
        console.log("file success");
      }
    }
    try {
      await uploadFile(
        JSON.stringify(req.body, null, 2),
        fileName + ".json",
        "application/json"
      );
    } catch (error) {
      console.log("Error uploading metadata!! ", error);
      return res.status(400).send(error);
    }
    if (process.env.DEBUG === "local_") {
      console.log("body success");
    }
    return res.status(200).send("Success!");
  });

  server.get("*", (req, res) => {
    handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, err => {
    if (err) throw err;
    console.log("> Ready on http://localhost:" + port);
  });
});
