const mongoose = require('mongoose')
const Person = require('./models/Person')
require('dotenv').config()

const contactName = process.argv[2]
const contactNumber = process.argv[3]

const mongoDB = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(mongoDB)

if (!contactName) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  const newPerson = new Person({
    name: contactName,
    number: contactNumber,
  })

  newPerson.save().then(() => {
    console.log('Saved person:', newPerson)
    mongoose.connection.close()
  })
}
