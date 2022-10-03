import {
  Direction,
  State,
  Entity,
  Position,
  isSamePosition,
} from '../../common'
import { MOVE_SELECTION_MILLIS } from '../src/game'

type MoveAttempt = [string, Direction]

const BASE_URL = 'http://localhost:3000'
// const BASE_URL = 'https://backend-m4fko6ztna-lz.a.run.app/'

export const waitForMoveExecution = async () =>
  new Promise((resolve) => setTimeout(resolve, MOVE_SELECTION_MILLIS * 1.5))

const getState = async (): Promise<State> =>
  fetch(BASE_URL).then((x) => x.json())

export const recordMoves = async (moves: MoveAttempt[]) =>
  Promise.all(moves.map(recordMove))

const recordMove = async ([playerName, direction]: MoveAttempt) =>
  fetch(`${BASE_URL}/${playerName}/${direction}`, {
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
  position: Position
) => {
  const state = await getState()
  const entity = state.entities.find(entityGuard)
  if (!isSamePosition(entity.position, position)) {
    log(console.error, { entity }, { position })
    throw new Error('assertEntityIsInPosition failure')
  }
}

export const assertEntityIsNotInPosition = async (
  entityGuard: (entity: Entity) => boolean,
  position: Position
) => {
  const state = await getState()
  const entity = state.entities.find(entityGuard)
  if (isSamePosition(entity.position, position)) {
    log(console.error, { entity }, { position })
    throw new Error('assertEntityIsNotInPosition failure')
  }
}

export const assertScore = async (expectedScore: number) => {
  const state = await getState()
  const score = state.score
  if (score !== expectedScore) {
    log(console.error, { score }, { expectedScore })
    throw new Error('assertScore failure')
  }
}

export const assertPlayerCount = async (expectedPlayerCount: number) => {
  const state = await getState()
  const count = state.players.length
  if (count !== expectedPlayerCount) {
    log(console.error, { count }, { expectedPlayerCount })
    throw new Error('assertPlayerCount failure')
  }
}

export const assertMoveCount = async (expectedMoveCount: number) => {
  const state = await getState()
  const count = state.players.flatMap((x) => x.moves).length
  if (count !== expectedMoveCount) {
    log(console.error, { count }, { expectedMoveCount })
    throw new Error('assertMoveCount failure')
  }
}
