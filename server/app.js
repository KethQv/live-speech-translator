const translate = require("@vitalets/google-translate-api");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../client/dist")));

app.post("/", (req, res) => {
  getTranslation(req.body.text, { to: req.body.language }).then(
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
