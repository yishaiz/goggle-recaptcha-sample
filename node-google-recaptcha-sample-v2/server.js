const express = require('express')
const bodyParser = require('body-parser')

const request = require('request')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))

 // app.use('/', (req, res) => res.sendFile('./index.html'))

app.get('/', (req, res) => { // Sending our HTML file to browser.
    res.sendFile(__dirname + '/index.html')
});

app.post('/submit', (req, res) => {
    // g-recaptcha-response is the key that browser will generate upon form submit.
    // if its blank or null means user has not selected the captcha, so return the error.
    if (req.body[ 'g-recaptcha-response' ] === undefined || req.body[ 'g-recaptcha-response' ] === '' || req.body[ 'g-recaptcha-response' ] === null) {
        return res.json({ "responseCode" : 1, "responseDesc" : "Please select captcha" });
    }

    // Put your secret key here.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            // const secretKey = "--paste your secret key here--";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              const secretKey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx";

    // req.connection.remoteAddress will provide IP address of connected user.
    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body[ 'g-recaptcha-response' ] + "&remoteip=" + req.connection.remoteAddress;

    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl, (error, response, body) => {
        body = JSON.parse(body);

        // Success will be true or false depending upon captcha validation.
        if (body.success !== undefined && !body.success) {
            return res.json({ "responseCode" : 1, "responseDesc" : "Failed captcha verification" });
        }
        res.json({ "responseCode" : 0, "responseDesc" : "Success" });
    });
});
c
// This will handle 404 requests.
app.use("*", function (req, res) {
    res.status(404).send("404");
})

const port = process.env.PORT || 8000
const server = app.listen(port, () => console.log(`Server listening on ${port}`))



