const express = require("express");
const morgan = require("morgan");
const data = require("./data");
const app = express();

app.use(express.json());

const customLogFunc = (tokens, req, res) => {
  const defaultLog = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ];

  if (req.method === "POST") {
    defaultLog.push(JSON.stringify(req.body));
  }
  return defaultLog.join(" ");
};

app.use(morgan(customLogFunc));

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

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = data.persons.find((person) => person.id === id);

  if (!person) {
    // console.log("Person does not exist!");
    res.status(404).send("Person does not exist!");
  } else {
    // console.log("Send person info:", person);
    res.json(person);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  data.persons = data.persons.filter((person) => person.id !== id);
  // console.log(`Deleted person with id ${id}`);
  // console.log(data.persons);
  res.send(`Deleted person with id ${id}`);
});

app.post("/api/persons", (req, res) => {
  const newPerson = {
    name: req.body.name,
    number: req.body.number,
    id: Math.floor(Math.random() * 100000),
  };

  if (newPerson.name.length === 0) {
    return res.status(400).json({
      error: "name missing",
    });
  }

  if (newPerson.number.length === 0) {
    return res.status(400).json({
      error: "number missing",
    });
  }

  const personExists = data.persons.find(
    (person) => person.name === newPerson.name
  );

  if (personExists) {
    return res.status(400).json({ error: "name must be unique" });
  }

  data.persons.push(newPerson);
  // console.log(newPerson);
  // console.log(data.persons);
  res.json(newPerson);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
