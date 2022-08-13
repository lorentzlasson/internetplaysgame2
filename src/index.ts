import express from 'express'

const PORT = 3000

const app = express()

type Square = 'Empty' | 'Bomb' | 'Coin'
type State = {
  grid: [
    [Square, Square, Square],
    [Square, Square, Square],
    [Square, Square, Square]
  ]
}

const state: State = {
  grid: [
    ['Empty', 'Empty', 'Empty'],
    ['Empty', 'Empty', 'Empty'],
    ['Empty', 'Empty', 'Empty'],
  ],
}

app.get('/', async (_req, res) => {
  res.json(state)
})

app.listen(PORT, () => {
  console.log(`Game running on port ${PORT}`)
})
