require("dotenv").config();
const googleTranslate = require("google-translate")(process.env.GOOGLE_API_KEY);
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/get-languages", (req, res) => {
  googleTranslate.getSupportedLanguages("en", (err, languageCodes) => {
    err ? console.log(err) : res.send(languageCodes);
  });
});

app.post("/translate", (req, res) => {
  googleTranslate.translate(req.body.text, req.body.to, (err, translation) => {
    if (err) console.log(err);
    res.send(translation.translatedText);
  });
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
