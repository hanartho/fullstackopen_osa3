require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

// TESTI
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

let puhelinluettelo = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '044-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '13-323231-23-3',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '32-4556-789-5',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '44-5-3-566544-2',
  },
]

app.use(morgan('tiny'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  const amount = puhelinluettelo.length
  const now = new Date()
  res.send(`<p>Phonkebook has info for ${amount} persons</p> <p> ${now} </p>`)
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
  /** 
  const id = Number(req.params.id);
  const person = puhelinluettelo.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
  */
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((res) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
  /** 
  const id = Number(req.params.id);
  puhelinluettelo = puhelinluettelo.filter((person) => person.id !== id);

  res.status(204).end;
  */
})

const generateId = () => {
  return Math.floor(Math.random() * 500)
}

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  console.log(body.name)

  if (body.name === undefined) {
    return res.status(400).json({ error: 'name missing' })
  }
  if (body.number === undefined) {
    return res.status(400).json({ error: 'number missing' })
  }

  const nameCheck = puhelinluettelo.find((person) => person.name === body.name)
  if (nameCheck) {
    return res.status(400).json({ error: 'name must be unique' })
  }
  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  })

  //puhelinluettelo = puhelinluettelo.concat(person);
  //res.json(person);

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unkown endpoint' })
}

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(unknownEndpoint)
app.use(errorHandler)
