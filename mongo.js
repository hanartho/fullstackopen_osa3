const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://hanart:${password}@cluster0.rvdjox8.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const name = process.argv[3];
const number = process.argv[4];

const person = new Person({
  name: name,
  number: number,
});

if (process.argv.length > 3) {
  person.save().then((res) => {
    console.log(`added ${name} ${number} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length == 3) {
  Person.find({}).then((res) => {
    console.log("Phonebook");
    res.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}
/** 
Person.find({}).then((res) => {
  res.forEach((person) => {
    console.log(person);
  });
  mongoose.connection.close();
});
*/
