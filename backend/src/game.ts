type Position = [number, number]
type Move = [number, number]
type State = {
  height: number
  width: number
  score: number
  entities: Entity[]
  // TODO: possible to have position as key in map?
  // entities: { [key in Position]: Entity }
}

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

const DIRECTIONS = ['up', 'down', 'left', 'right'] as const

type Direction = typeof DIRECTIONS[number]

export const isDirection = (token: any): token is Direction =>
  DIRECTIONS.includes(token)

const isCoin = (entity: Entity): entity is Coin => entity.__type === 'coin'

const isAvatar = (entity: Entity): entity is Avatar =>
  entity.__type === 'avatar'

const isBomb = (entity: Entity): entity is Bomb => entity.__type === 'bomb'

const MOVES: {
  [key in Direction]: Move
} = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
}

const state: State = {
  height: 3,
  width: 3,
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
}

const positionIsAllowed = ([x, y]: Position): boolean =>
  x >= 0 && x < state.width && y >= 0 && y < state.height

const positionIsCoin = ([x, y]: Position): boolean =>
  state.entities.some(
    (e) => isCoin(e) && e.position[0] === x && e.position[1] === y
  )

const positionIsBomb = ([x, y]: Position): boolean =>
  state.entities.some(
    (e) => isBomb(e) && e.position[0] === x && e.position[1] === y
  )

const randomCapped = (cap: number) => Math.floor(Math.random() * cap)
const randomPosition = (): Position => [
  randomCapped(state.width),
  randomCapped(state.height),
]

const respawnCoin = () => {
  const coin = state.entities.find(isCoin)
  if (!coin) throw new Error('bomb not found')
  coin.position = randomPosition()
}

const respawnBomb = () => {
  const bomb = state.entities.find(isBomb)
  if (!bomb) throw new Error('bomb not found')
  bomb.position = randomPosition()
}

const collectCoin = () => {
  state.score++
  respawnCoin()
}

const blowUpBomb = () => {
  state.score = 0
  respawnBomb()
}

export const move = (direction: Direction): State => {
  const avatar = state.entities.find(isAvatar)
  if (!avatar) throw new Error('avatar not found')
  const [x, y] = avatar.position

  const [mX, mY] = MOVES[direction]
  const newPos: Position = [x + mX, y + mY]

  if (!positionIsAllowed(newPos)) {
    return state
  }

  avatar.position = newPos

  if (positionIsCoin(newPos)) {
    collectCoin()
  }

  if (positionIsBomb(newPos)) {
    blowUpBomb()
  }

  return state
}
