require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const data = require("./data");
const app = express();
const Person = require("./models/Person");

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

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
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = data.persons.find((person) => person.id === id);

  if (!person) {
    res.status(404).send("Person does not exist!");
  } else {
    res.json(person);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const personToBeDeleted = Person.findByIdAndRemove(req.params.id).then(
    (result) => {
      res.status(204).json(personToBeDeleted);
    }
  );
});

app.post("/api/persons", (req, res) => {
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  });

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

  newPerson.save().then(() => {
    res.json(newPerson);
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
