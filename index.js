const express = require("express");
const data = require("./data");
const app = express();

app.use(express.json());

const PORT = 3001;

app.get("/", (req, res) => {
  res.redirect("/info");
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      data.persons.length
    } people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
