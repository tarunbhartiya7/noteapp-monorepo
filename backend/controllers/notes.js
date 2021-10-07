const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()

const Note = require('../models/note')
const User = require('../models/user')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.delete('/:id', async (request, response) => {
  const note = await Note.findByIdAndRemove(request.params.id)
  if (note) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response) => {
  const { content, important } = request.body

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: content,
    important: important || false,
    date: new Date(),
    user: user._id,
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote)
})

notesRouter.put('/:id', async (request, response) => {
  const { content, important } = request.body

  const note = {
    content,
    important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
  })
  response.json(updatedNote)
})

module.exports = notesRouter
