const express = require('express');

const PORT = 3000;
const HOST = "localhost";

const app = express();

app.set("views", "./views");

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/stock", (req, res) => {
  res.render("homepage");
})

app.get("/stock/:ticker", (req, res) => {
  res.send(req.params.ticker);
})

app.get("stock/search", (req, res) => {
  console.log(req.params);
  res.render("searchresult", req.params);
})

app.listen(PORT, HOST, () => {
  console.log(`App listening on port ${PORT}...`);
});