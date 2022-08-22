import express from 'express'
import { isDirection, move } from './game'

const PORT = 3000

const app = express()

app.post('/:player/:direction', async (req, res) => {
  const {
    params: { direction, player: playerName },
  } = req

  if (!isDirection(direction)) {
    res.status(400)
    res.end()
    return
  }
  const state = move(direction, playerName)
  res.json(state)
})

app.listen(PORT, () => {
  console.log(`Game running on port ${PORT}`)
})
