import express from 'express'
import { isDirection, move } from './game'

const PORT = 3000

const app = express()

app.post('/:direction', async (req, res) => {
  const {
    params: { direction },
  } = req

  if (!isDirection(direction)) {
    res.status(400)
    res.end()
    return
  }
  const state = move(direction)
  res.json(state)
})

app.listen(PORT, () => {
  console.log(`Game running on port ${PORT}`)
})
