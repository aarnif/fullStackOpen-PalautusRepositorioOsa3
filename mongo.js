const mongoose = require("mongoose");

const password = process.argv[2];
const contactName = process.argv[3];
const contactNumber = process.argv[4];

const mongoDB = `mongodb+srv://aarnif:${password}@cluster0.wuukb0r.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(mongoDB);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (!contactName) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  const newPerson = new Person({
    name: contactName,
    number: contactNumber,
  });

  newPerson.save().then((res) => {
    console.log("Saved person:", newPerson);
    mongoose.connection.close();
  });
}
