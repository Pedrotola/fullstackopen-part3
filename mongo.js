const mongoose = require('mongoose')

if(process.argv.length<3){
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.ewqzvxb.mongodb.net/`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String, 
})

const Person = new mongoose.model('Person', personSchema)

const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
  name: name,
  number: number,
})

if (process.argv.length < 5) {
  Person.find({}).then(person=>{
    console.log('phonebook:')
    person.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
} else{
  person.save().then(result =>{
    console.log('Person saved!')
    mongoose.connection.close()
  })
}