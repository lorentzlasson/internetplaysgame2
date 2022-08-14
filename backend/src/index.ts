import express from 'express'

const PORT = 3000

const app = express()

type Position = [number, number]
type Move = [number, number]
type State = {
  height: number
  width: number
  avatar: Position
}

const DIRECTIONS = ['up', 'down', 'left', 'right'] as const

type Direction = typeof DIRECTIONS[number]

const MOVES: {
  [key in Direction]: Move
} = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
}

let state: State = {
  height: 3,
  width: 3,
  avatar: [0, 2],
}

const isDirection = (token: any): token is Direction =>
  DIRECTIONS.includes(token)

const positionIsAllowed = ([x, y]: Position): boolean =>
  x >= 0 && x < state.width && y >= 0 && y < state.height

const move = (direction: Direction): State => {
  const [x, y] = state.avatar
  const [mX, mY] = MOVES[direction]
  const newPos: Position = [x + mX, y + mY]

  if (!positionIsAllowed(newPos)) {
    return state
  }

  state.avatar = newPos

  return state
}

app.post('/:direction', async (req, res) => {
  const {
    params: { direction },
  } = req

  if (!isDirection(direction)) {
    res.status(400)
    res.end()
    return
  }
  move(direction)
  res.json(state)
})

app.get('/', async (_req, res) => {
  res.json(state)
})

app.listen(PORT, () => {
  console.log(`Game running on port ${PORT}`)
})
