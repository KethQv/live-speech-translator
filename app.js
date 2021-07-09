const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request, response) => {
  response.render("home.ejs");
});

app.listen(process.env.PORT || 3000);
