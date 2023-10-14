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

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const newPersons = persons.filter((person) => person.id !== id);
  console.log(`Deleted person with id ${id}`);
  console.log(newPersons);
  res.send(`Deleted person with id ${id}`);
});

app.post("/api/persons", (req, res) => {
  const newPerson = {
    name: req.body.name,
    number: req.body.number,
    id: Math.floor(Math.random() * 100000),
  };
  console.log(newPerson);
  console.log(persons);
  res.send(`Added person with id ${newPerson.id}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
