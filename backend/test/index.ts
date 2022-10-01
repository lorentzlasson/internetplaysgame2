import {
  Direction,
  State,
  MOVE_SELECTION_MILLIS,
  Entity,
  Position,
  isCoin,
  isAvatar,
  isBomb,
  isSamePosition,
} from '../src/game'

type MoveAttempt = [string, Direction]

const waitForMoveExecution = async () =>
  new Promise((resolve) => setTimeout(resolve, MOVE_SELECTION_MILLIS * 1.5))

const getState = async (): Promise<State> =>
  fetch('http://localhost:3000').then((x) => x.json())

const recordMoves = async (moves: MoveAttempt[]) =>
  Promise.all(moves.map(recordMove))

const recordMove = async ([playerName, direction]: MoveAttempt) =>
  fetch(`http://localhost:3000/${playerName}/${direction}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((x) => x.json())

const log = (logFunction: (x: any) => any, ...args: Object[]) => {
  const prettyArgs = JSON.stringify(args, null, 2)
  logFunction(prettyArgs)
}

const logState = async () => log(console.log, await getState())

const assertEntityIsInPosition = async (
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

const assertEntityIsNotInPosition = async (
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

const assertScore = async (expectedScore: number) => {
  const state = await getState()
  const score = state.score
  if (score !== expectedScore) {
    log(console.error, { score }, { expectedScore })
    throw new Error('assertScore failure')
  }
}

const assertPlayerCount = async (expectedPlayerCount: number) => {
  const state = await getState()
  const count = state.players.length
  if (count !== expectedPlayerCount) {
    log(console.error, { count }, { expectedPlayerCount })
    throw new Error('assertPlayerCount failure')
  }
}

const assertMoveCount = async (expectedMoveCount: number) => {
  const state = await getState()
  const count = state.players.flatMap((x) => x.moves).length
  if (count !== expectedMoveCount) {
    log(console.error, { count }, { expectedMoveCount })
    throw new Error('assertMoveCount failure')
  }
}

const runFlow = async () => {
  // Verify initial state
  await Promise.all([
    assertEntityIsInPosition(isAvatar, [0, 2]),
    assertEntityIsInPosition(isCoin, [2, 0]),
    assertEntityIsInPosition(isBomb, [0, 1]),
    assertScore(0),
  ])

  await recordMoves([
    ['a', 'right'],
    ['b', 'right'],
  ])
  await waitForMoveExecution()

  await recordMoves([
    ['a', 'right'],
    ['b', 'right'],
  ])
  await waitForMoveExecution()

  await recordMoves([
    ['a', 'up'],
    ['b', 'up'],
  ])
  await waitForMoveExecution()

  await recordMoves([
    ['a', 'up'],
    ['b', 'up'],
  ])
  await waitForMoveExecution()

  await Promise.all([
    // Coin is collected
    assertScore(1),
    // Coin has respawned in new location location
    assertEntityIsNotInPosition(isCoin, [2, 0]),
  ])

  await recordMoves([
    ['a', 'left'],
    ['c', 'left'],
  ])
  await waitForMoveExecution()

  await recordMoves([
    ['a', 'down'],
    ['c', 'down'],
  ])
  await waitForMoveExecution()

  await recordMoves([
    ['a', 'left'],
    ['c', 'left'],
  ])
  await waitForMoveExecution()

  await Promise.all([
    // Bomb is blown up, reseting score to 0
    // (Score might have gone up over 1 before bomb explosion depending on randomized respawn location on coin)
    assertScore(0),

    // Avatar is in position where bomb was previously
    assertEntityIsInPosition(isAvatar, [0, 1]),
    // Bomb has respawned in new location location
    assertEntityIsNotInPosition(isBomb, [0, 1]),

    assertPlayerCount(3),
    assertMoveCount(7),
  ])

  if (process.env.VERBOSE) await logState()

  console.log('TEST PASS')
}

runFlow()
