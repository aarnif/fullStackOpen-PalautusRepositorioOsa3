const express = require("express");
const data = require("./data");
const app = express();

app.use(express.json());

const PORT = 3001;
const persons = data.persons;

app.get("/", (req, res) => {
  res.redirect("/info");
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(data);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    console.log("Person does not exist!");
    res.status(404).send("Person does not exist!");
  } else {
    console.log("Send person info:", person);
    res.json(person);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
