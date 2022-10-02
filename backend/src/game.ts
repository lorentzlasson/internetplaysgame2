import {
  Position,
  State,
  MOVES,
  POSITIONS,
  Entity,
  Direction,
  isAvatar,
  isBomb,
  isCoin,
  isSamePosition,
  positionIsAllowed,
  DEFAULT_MOVE_SELECTION_MILLIS,
} from '../../common'

export const MOVE_SELECTION_MILLIS =
  parseInt(process.env.MOVE_SELECTION_MILLIS || '') ||
  DEFAULT_MOVE_SELECTION_MILLIS

// ---------- STATE ----------

const state: State = {
  score: 0,
  entities: [
    {
      __type: 'avatar',
      position: [0, 2],
    },
    {
      __type: 'coin',
      position: [2, 0],
    },
    {
      __type: 'bomb',
      position: [0, 1],
    },
  ],
  players: [],
  moveCandidates: [],
}

// ---------- READS ----------

const findPlayer = (playerName: string) =>
  state.players.find((p) => p.name === playerName)

const findAvatar = () => {
  const avatar = state.entities.find(isAvatar)
  if (!avatar) throw new Error('avatar not found')
  return avatar
}

const positionHasEntity = (
  pos: Position,
  entityGuard: (entity: Entity) => boolean
): boolean =>
  state.entities.some((e) => entityGuard(e) && isSamePosition(e.position, pos))

const randomCapped = (cap: number) => Math.floor(Math.random() * cap)

const randomAvailablePosition = (): Position => {
  const occupiedPositions = state.entities.map((e) => e.position)
  const availablePositions = POSITIONS.filter(
    (pos) =>
      !occupiedPositions.some((occupiedPos) => isSamePosition(occupiedPos, pos))
  )
  const randomIndex = randomCapped(availablePositions.length - 1)
  return availablePositions[randomIndex]
}

const randomMoveCandidate = () => {
  const randomIndex = randomCapped(state.moveCandidates.length)
  return state.moveCandidates[randomIndex]
}

export const getState = () => state

// ---------- MUTATIONS ----------

const respawn = (entityGuard: (entity: Entity) => boolean) => {
  const entity = state.entities.find(entityGuard)
  if (!entity) throw new Error('entity not found')
  entity.position = randomAvailablePosition()
}

const collectCoin = () => {
  state.score++
  respawn(isCoin)
}

const blowUpBomb = () => {
  state.score = 0
  respawn(isBomb)
}

const clearMoveCandiates = () => {
  state.moveCandidates = []
}

const createPlayer = (playerName: string) => {
  const player = {
    name: playerName,
    moves: [],
  }
  state.players.push(player)
  return player
}

const ensurePlayer = (playerName: string) => {
  const player = findPlayer(playerName)
  if (!player) {
    return createPlayer(playerName)
  }
  return player
}

export const recordMove = (direction: Direction, playerName: string): State => {
  const player = ensurePlayer(playerName)

  const [x, y] = findAvatar().position

  const move = MOVES[direction]
  const [mX, mY] = move
  const newPosition: Position = [x + mX, y + mY]

  if (!positionIsAllowed(newPosition)) {
    console.log(
      `player ${player.name} move ${direction} to ${newPosition} is not allowed`
    )
    return state
  }

  state.moveCandidates.push({
    player,
    move,
    newPosition,
  })

  console.log(
    `player ${player.name} move ${direction} to ${newPosition} is added to candidates`
  )

  return state
}

export const executeNextMove = () => {
  const moveCandidates = state.moveCandidates
  console.log(`move candidates: ${moveCandidates.length}`)

  if (moveCandidates.length !== 0) {
    const nextMove = randomMoveCandidate()

    const avatar = findAvatar()

    avatar.position = nextMove.newPosition

    nextMove.player.moves.push(nextMove.move)

    if (positionHasEntity(nextMove.newPosition, isCoin)) {
      collectCoin()
    }

    if (positionHasEntity(nextMove.newPosition, isBomb)) {
      blowUpBomb()
    }

    console.log(
      `player ${nextMove.player.name} move ${nextMove.move} to ${nextMove.newPosition} was executed`
    )

    clearMoveCandiates()
  }

  setTimeout(executeNextMove, MOVE_SELECTION_MILLIS)
}
