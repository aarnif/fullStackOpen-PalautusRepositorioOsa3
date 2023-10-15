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

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "invalid id!" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

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
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${
        persons.length
      } people</p><p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const findPerson = Person.findById(req.params.id);

  findPerson
    .then((person) => {
      if (!person) {
        return res.status(400).json({
          error: "Person with that id does not exists!",
        });
      }
      res.json(person);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const updatedPerson = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findByIdAndUpdate(req.params.id, updatedPerson, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const personToBeDeleted = Person.findByIdAndRemove(req.params.id, {
    new: true,
  });
  personToBeDeleted
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
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

  newPerson
    .save()
    .then(() => {
      res.json(newPerson);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
