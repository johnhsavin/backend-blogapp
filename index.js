import express from "express"
import cors from 'cors'
import { MongoClient } from 'mongodb'

import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())


const client = new MongoClient(process.env.MONGO_URI)
const db = client.db('blogapp-c12')
const blogPosts = db.collection('blog-posts')
const userDb = db.collection('users')

client.connect()
console.log('Connected to Mongo')

app.get('/', async (req, res) => {
  const allPosts = await blogPosts.find().toArray()
  console.log(allPosts)
  res.send(allPosts)
})

app.post('/', async (req, res) => {
  const newBlogPosts = { title: req.body.title, content: req.body.content }
  await blogPosts.insertOne(newBlogPosts)

  const allPosts = await blogPosts.find().toArray()
  res.send(allPosts)
})

//signup
app.post('/signup', async (req, res) => {
  const userAdded = await userDb.insertOne({email: req.body.email, password: req.body.password})
  console.log('user added -> ', userAdded)
	res.send(userAdded)
})

// log in
app.post('/login', async (req, res) => {
	console.log(req.body)
  const userFound = await userDb.findOne({email: req.body.email})

  res.send(userFound)
})

app.listen(process.env.PORT || 8080, () => console.log('API listening on port 8080'))









