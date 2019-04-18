const express = require("express");
const bodyParser = require("body-parser");

const request = require("request");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/submit", (req, res) => {
  // if its blank or null means user has not selected the captcha, so return the error.
  if (
    req.body["g-recaptcha-response"] === undefined ||
    req.body["g-recaptcha-response"] === "" ||
    req.body["g-recaptcha-response"] === null
  ) {
    return res.json({ responseCode: 1, responseDesc: "Please select captcha" });
  }

  const secretKey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx";

  const verificationUrl =
   "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + 
   "&response=" + req.body[ 'g-recaptcha-response' ] + 
   "&remoteip=" + req.connection.remoteAddress;

   console.log({verificationUrl})
  
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl, (error, response, body) => {
    body = JSON.parse(body);

    console.log({body})
  
    // Success will be true or false depending upon captcha validation.
    if (body.success !== undefined && !body.success) {
      return res.json({
        responseCode: 1,
        responseDesc: "Failed captcha verification"
      });
    }
    res.json({ responseCode: 0, responseDesc: "Success" });
  });
});

// This will handle 404 requests.
app.use("*", function(req, res) {
  res.status(404).send("404");
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () =>
  console.log(`Server listening on ${port}`)
);
