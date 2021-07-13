const translate = require("@vitalets/google-translate-api");
const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get("/", (req, res) => {
  res.render("index.ejs", {
    languages: translate.languages,
  });
});

app.post("/", (req, res) => {
  getTranslation(req.body.text, { from: req.body.from, to: req.body.to }).then(
    (translation) => {
      res.send(translation);
    }
  );
});

app.listen(process.env.PORT || 3000);

async function getTranslation(text, language) {
  const response = await translate(text, language);
  const translation = response.text;
  return translation;
}
