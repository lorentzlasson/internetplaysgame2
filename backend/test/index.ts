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

// TODO: allow configuration of MOVE_SELECTION_MILLIS to be able to run
// faster in test than in prod
const waitForMoveExecution = async () =>
  new Promise((resolve) => setTimeout(resolve, MOVE_SELECTION_MILLIS * 1.5))

const getState = async (): Promise<State> =>
  fetch('http://localhost:3000').then((x) => x.json())

const move = async (
  playerName: string,
  direction: Direction
): Promise<State> => {
  await fetch(`http://localhost:3000/${playerName}/${direction}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((x) => x.json())

  await waitForMoveExecution()

  return getState()
}

const log = (logFunction: (x: any) => any, ...args: Object[]) => {
  const prettyArgs = JSON.stringify(args, null, 2)
  logFunction(prettyArgs)
}

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

const runFlow = async () => {
  // Verify initial state
  await Promise.all([
    assertEntityIsInPosition(isAvatar, [0, 2]),
    assertEntityIsInPosition(isCoin, [2, 0]),
    assertEntityIsInPosition(isBomb, [0, 1]),
    assertScore(0),
  ])

  // TODO: make several move before awaiting move selection
  await move('a', 'right')
  await move('b', 'right')
  await move('a', 'up')
  await move('b', 'up')

  // Coin is collected
  await assertScore(1)

  await move('a', 'left')
  await move('c', 'down')
  await move('a', 'left')

  await Promise.all([
    // Bomb is blown up, reseting score to 0
    // (Score might have gone up over 1 before bomb explosion depending on randomized respawn location on coin)
    assertScore(0),

    // Avatar has moved and both coin and bomb has changed location
    assertEntityIsInPosition(isAvatar, [0, 1]),
    assertEntityIsNotInPosition(isCoin, [2, 0]),
    assertEntityIsNotInPosition(isBomb, [0, 1]),

    assertPlayerCount(3),
  ])

  console.log('TEST PASS')
}

runFlow()
