const express = require("express");
const data = require("./data");
const app = express();

app.use(express.json());

const PORT = 3001;

app.get("/", (req, res) => {
  res.redirect("/api/persons");
});

app.get("/api/persons", (req, res) => {
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
