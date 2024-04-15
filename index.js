const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
 
app.post("/getAccessToken", (req, res) => {
  const { code } = req.body;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  const urlencoded = new URLSearchParams();
  urlencoded.append("client_id", process.env.CLIENT_ID);
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("scope", "https://graph.microsoft.com/.default");
  urlencoded.append("client_secret", process.env.CLIENT_SEC);
  urlencoded.append("code", code);
  urlencoded.append("redirect_uri", `${process.env.REDIRECT_URI}/assets/login.html`);
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };
  fetch(
    `https://login.microsoftonline.com/${process.env.TENANT}/oauth2/v2.0/token`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.post("/refreshTokens", (req, res) => {
  const { refreshToken } = req.body;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  const urlencoded = new URLSearchParams();
  urlencoded.append("client_id", process.env.CLIENT_ID);
  urlencoded.append("grant_type", "refresh_token");
  urlencoded.append("client_secret", process.env.CLIENT_SEC);
  urlencoded.append("refresh_token", refreshToken);
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };
  fetch(
    `https://login.microsoftonline.com/${process.env.TENANT}/oauth2/v2.0/token`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      res.json({ result });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/", (req, res) => {
  res.send("Working...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
