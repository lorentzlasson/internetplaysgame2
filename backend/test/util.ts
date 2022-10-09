import { strict as assert } from 'node:assert'
import { Direction, State, Entity, Position } from '../../common'
import { MOVE_SELECTION_MILLIS } from '../src/game'
import { config } from 'dotenv'
config()

type MoveAttempt = [string, Direction]

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

export const waitForMoveExecution = async () =>
  new Promise((resolve) => setTimeout(resolve, MOVE_SELECTION_MILLIS * 1.5))

const getState = async (): Promise<State> =>
  fetch(BACKEND_URL).then((x) => x.json())

export const recordMoves = async (moves: MoveAttempt[]) =>
  Promise.all(moves.map(recordMove))

const recordMove = async ([playerName, direction]: MoveAttempt) =>
  fetch(`${BACKEND_URL}/${playerName}/${direction}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((x) => x.json())

const log = (logFunction: (x: any) => any, ...args: Object[]) => {
  const prettyArgs = JSON.stringify(args, null, 2)
  logFunction(prettyArgs)
}

export const logState = async () => log(console.log, await getState())

export const assertEntityIsInPosition = async (
  entityGuard: (entity: Entity) => boolean,
  expectedPosition: Position
) => {
  const state = await getState()
  const position = state.entities.find(entityGuard)?.position
  assert.deepEqual(position, expectedPosition)
}

export const assertEntityIsNotInPosition = async (
  entityGuard: (entity: Entity) => boolean,
  expectedPosition: Position
) => {
  const state = await getState()
  const position = state.entities.find(entityGuard)?.position
  assert.notDeepEqual(position, expectedPosition)
}

export const assertScore = async (expectedScore: number) => {
  const state = await getState()
  const score = state.score
  assert.equal(score, expectedScore)
}

export const assertPlayerCount = async (expectedPlayerCount: number) => {
  const state = await getState()
  const count = state.players.length
  assert.equal(count, expectedPlayerCount)
}

export const assertMoveCount = async (expectedMoveCount: number) => {
  const state = await getState()
  const count = state.moveHistory.length
  assert.equal(count, expectedMoveCount)
}

export const assertHighscore = async (expectedHighScores: number[]) => {
  const { highScore } = await getState()
  const anyEqual = expectedHighScores.includes(highScore)
  assert.equal(anyEqual, true)
}
