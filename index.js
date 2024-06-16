const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('dist'))


morgan.token('req', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())

const generateID = () =>{
    const id = Math.floor(Math.random()*10000)
    if (persons.some(p => p.id ===id)) {
        return Math.floor(Math.random()*10000)
    }else{
        return id
    }
}

app.post('/api/persons', (request, response)=>{
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: `Name or number is missing`
        })
    }
    if (persons.some(p => p.name == body.name)) {
        return response.status(400).json({
            error: `name must be unique`
        })
    }
    const person = {
        id: generateID(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons', (request, response)=>{
    response.json(persons)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    }else(
        response.status(400).end
    )
})

app.get('/info', (request, response) =>{
    response.send(`<p>Phonebook has info for ${persons.length} peoples </br> ${Date()}</p>`)
})

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
    console.log(`Listening in the Port ${PORT}`);
})