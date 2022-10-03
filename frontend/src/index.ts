import {
  State,
  MoveCandiate,
  isSamePosition,
  POSITIONS,
  Direction,
} from '../../common'

const ICONS = {
  bomb: '💣',
  coin: '🪙',
  avatar: '🏃',
  blank: '⬜',
}

const KEY_DIRECTION_MAP: { [key: string]: Direction } = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

const BASE_URL = 'http://localhost:3000'
// const BASE_URL = 'https://backend-m4fko6ztna-lz.a.run.app/'

const getState = async (): Promise<State> =>
  fetch(BASE_URL).then((x) => x.json())

const recordMove = async (playerName: string, direction: Direction) =>
  fetch(`${BASE_URL}/${playerName}/${direction}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((x) => x.json())

const getPlayerName = () =>
  (<HTMLInputElement>document.getElementById('playerName')).value

const handleKeyPress = async ({ key }: KeyboardEvent) => {
  const direction = KEY_DIRECTION_MAP[key]
  if (!direction) return

  const playerName = getPlayerName() || 'player name'
  const state = await recordMove(playerName, direction)
  console.log(state)
}

const renderMoveCandidates = (moveCandidates: MoveCandiate[]) => {
  const log = document.getElementById('log')
  log.innerHTML = ''
  moveCandidates.forEach(({ player: { name }, move }) => {
    const line = `Player: "${name}", Move: [${move}]`
    const node = document.createTextNode(line)
    const div = document.createElement('div')
    div.appendChild(node)
    log.appendChild(div)
  })
}

const rerender = async () => {
  const { entities, score, moveCandidates } = await getState()

  document.getElementById('score').textContent = score.toString()

  POSITIONS.forEach((position) => {
    const entity = entities.find((e) => isSamePosition(e.position, position))

    const emoji = entity ? ICONS[entity.__type] : ICONS.blank

    const elementID = position.toString()
    document.getElementById(elementID).textContent = emoji
  })

  renderMoveCandidates(moveCandidates)
}

const f = async () => {
  try {
    await rerender()
  } catch (error) {
    console.error(error)
  }
  setTimeout(f, 1000)
}

document.addEventListener('keydown', handleKeyPress)

f()
