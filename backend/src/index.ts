import express from 'express'
import cors from 'cors'
import http from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { recordMove, executeNextMove, getState } from './game'
import { isDirection, State } from '../../common'

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

const broadcast = (state: State) => {
  wsServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(state))
    }
  })
}

const server = http.createServer(app)

const wsServer = new WebSocketServer({ server })

server.listen(PORT, () => {
  console.log(`Game running on port ${PORT}`)

  executeNextMove(broadcast)
})
