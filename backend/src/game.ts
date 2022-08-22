// ---------- TYPES ----------
//
type Position = [number, number]
type Move = [number, number]

type BaseEntity = {
  position: Position
}

type Avatar = BaseEntity & {
  __type: 'avatar'
}

type Coin = BaseEntity & {
  __type: 'coin'
}

type Bomb = BaseEntity & {
  __type: 'bomb'
}

type Entity = Avatar | Coin | Bomb

type Player = {
  name: string
  moves: Move[]
}

type State = {
  score: number
  entities: Entity[]
  players: Player[]
}

const DIRECTIONS = ['up', 'down', 'left', 'right'] as const

type Direction = typeof DIRECTIONS[number]

const cartesian = (...a: any[][]) =>
  a.reduce((a2, b) => a2.flatMap((d) => b.map((e) => [d, e].flat())))
const range = (max: number) => Array.from(Array(max).keys())

// ---------- CONSTANTS ----------

const MOVES: {
  [key in Direction]: Move
} = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
}

const HEIGHT = 3
const WIDTH = 3

const POSITIONS: Position[] = cartesian(range(WIDTH), range(HEIGHT))

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
}

// ---------- PURE ----------

export const isDirection = (token: any): token is Direction =>
  DIRECTIONS.includes(token)

const isCoin = (entity: Entity): entity is Coin => entity.__type === 'coin'

const isAvatar = (entity: Entity): entity is Avatar =>
  entity.__type === 'avatar'

const isBomb = (entity: Entity): entity is Bomb => entity.__type === 'bomb'

const positionIsAllowed = ([x, y]: Position): boolean =>
  x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT

const isSamePosition = ([x1, y1]: Position, [x2, y2]: Position): boolean =>
  x1 === x2 && y1 === y2

// ---------- READS ----------

const findPlayer = (playerName: string) =>
  state.players.find((p) => p.name === playerName)

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

export const move = (direction: Direction, playerName: string): State => {
  const player = ensurePlayer(playerName)

  const avatar = state.entities.find(isAvatar)
  if (!avatar) throw new Error('avatar not found')
  const [x, y] = avatar.position

  const move = MOVES[direction]
  const [mX, mY] = move
  const newPos: Position = [x + mX, y + mY]

  if (!positionIsAllowed(newPos)) {
    return state
  }

  avatar.position = newPos
  player.moves.push(move)

  if (positionHasEntity(newPos, isCoin)) {
    collectCoin()
  }

  if (positionHasEntity(newPos, isBomb)) {
    blowUpBomb()
  }

  return state
}
