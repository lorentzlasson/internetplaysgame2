// ---------- TYPES ----------
export type Position = [number, number] // numbers should be constrained to width and height of game board
export type Move = [number, number] // numbers should be constrained to -1, 0, 1

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

export type Entity = Avatar | Coin | Bomb

type Player = {
  name: string
  moves: Move[]
}

export type MoveCandiate = {
  move: Move
  player: Player
  newPosition: Position
}

export type State = {
  score: number
  entities: Entity[]
  players: Player[]
  moveCandidates: MoveCandiate[]
}

const DIRECTIONS = ['up', 'down', 'left', 'right'] as const

export type Direction = typeof DIRECTIONS[number]

// ---------- CONSTANTS ----------

const cartesian = (...a: any[][]) =>
  a.reduce((a2, b) => a2.flatMap((d) => b.map((e) => [d, e].flat())))
const range = (max: number) => Array.from(Array(max).keys())

export const MOVES: {
  [key in Direction]: Move
} = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
}

const HEIGHT = 3
const WIDTH = 3

export const POSITIONS: Position[] = cartesian(range(WIDTH), range(HEIGHT))

export const DEFAULT_MOVE_SELECTION_MILLIS = 5000

// ---------- PURE ----------

export const isDirection = (token: any): token is Direction =>
  DIRECTIONS.includes(token)

export const isCoin = (entity: Entity): entity is Coin =>
  entity.__type === 'coin'

export const isAvatar = (entity: Entity): entity is Avatar =>
  entity.__type === 'avatar'

export const isBomb = (entity: Entity): entity is Bomb =>
  entity.__type === 'bomb'

export const positionIsAllowed = ([x, y]: Position): boolean =>
  x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT

export const isSamePosition = (
  [x1, y1]: Position,
  [x2, y2]: Position
): boolean => x1 === x2 && y1 === y2
