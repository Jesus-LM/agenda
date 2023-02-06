const express = require('express')
const app=express()
const morgan=require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
      id: 1,
      name: "Arturo Hellas",
      number: "012-345678"  
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-3254785" 
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-345678" 
    },
    {
        id: 4,
        name: "Mary Popendick",
        number: "33-39-567893" 
    }
  ]

app.get('/',(request,response)=>{
    response.send("<h1>En Construccion</h1>")
})

app.get('/info',(request,response)=>{
    response.send(`Phonebook has info for ${persons.length} people.<br>
    ${new Date()}`)
})

app.get("/api/persons",(request,response)=>{
  response.json(persons)
})

app.get("/api/persons/:id",(request,response)=>{
  const person=persons.find(p=>p.id===Number(request.params.id))
  if (!person) response.status(404).end()
  else response.json(person)
  })

app.delete("/api/persons/:id",(request,response)=>{
  persons=persons.filter(p=>p.id!==Number(request.params.id))
  response.status(204).end()
  })

app.post("/api/persons/",(request,response)=>{
  if (!request.body.name || !request.body.number) return response.status(400).json({error:"name or number can't be blank"})
  if (persons.find(p=>p.name===request.body.name)) return response.status(400).json({error:"name must be unique"})

  const newPerson={
    "id":Math.random()*1000000,
    "name":request.body.name,
    "number":request.body.number
  }
  morgan.token('body', request => JSON.stringify(request.body))
  persons=persons.concat(newPerson)
  response.json(newPerson)

  })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
