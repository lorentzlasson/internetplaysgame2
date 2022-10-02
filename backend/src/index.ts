import express from 'express'
import cors from 'cors'
import { recordMove, executeNextMove, getState } from './game'
import { isDirection } from '../../common'

const PORT = 3000

const app = express()
app.use(cors())

app.get('*', async (_req, res) => {
  res.json(getState())
})

app.post('/:player/:direction', async (req, res) => {
  const {
    params: { direction, player: playerName },
  } = req

  if (!isDirection(direction)) {
    res.status(400)
    res.end()
    return
  }
  const state = recordMove(direction, playerName)
  res.json(state)
})

app.listen(PORT, () => {
  console.log(`Game running on port ${PORT}`)

  executeNextMove()
})
