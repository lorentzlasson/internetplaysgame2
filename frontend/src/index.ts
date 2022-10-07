import {
  State,
  MoveCandidate,
  Move,
  isSamePosition,
  POSITIONS,
  Direction,
  DEFAULT_MOVE_SELECTION_MILLIS,
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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
const BACKEND_WS_URL =
  import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:3000'

const getState = async (): Promise<State> =>
  fetch(BACKEND_URL).then((x) => x.json())

const recordMove = async (playerName: string, direction: Direction) =>
  fetch(`${BACKEND_URL}/${playerName}/${direction}`, {
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
  render(state)
}

const prettifyTime = (timeString: string) => {
  const time = new Date(timeString)
  return time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
}

const renderMoveTimer = (lastMoveAtString: string) => {
  const lastMoveAt = new Date(lastMoveAtString).getTime()
  const now = new Date().getTime()
  const timePassed = now - lastMoveAt
  const timeLeft = DEFAULT_MOVE_SELECTION_MILLIS - timePassed
  document.getElementById('moveTimer').textContent = timeLeft.toString()
}

const renderMoveCandidates = (moveCandidates: MoveCandidate[]) => {
  const element = document.getElementById('moveCandidates')
  element.innerHTML = ''
  moveCandidates.forEach(({ player: { name }, direction }) => {
    const line = name + ' wants to move ' + direction
    const node = document.createTextNode(line)
    const div = document.createElement('div')
    div.appendChild(node)
    element.appendChild(div)
  })
}

const renderMoveHistory = (moveHistory: Move[]) => {
  const element = document.getElementById('moveHistory')
  element.innerHTML = ''
  moveHistory.forEach(({ player: { name }, direction, time }) => {
    const line = prettifyTime(time) + ' | ' + name + ' moved ' + direction
    const node = document.createTextNode(line)
    const div = document.createElement('div')
    div.appendChild(node)
    element.appendChild(div)
  })
}

const render = async (state: State) => {
  const { entities, score, moveCandidates, moveHistory, lastMoveAt } = state

  document.getElementById('score').textContent = score.toString()

  POSITIONS.forEach((position) => {
    const entity = entities.find((e) => isSamePosition(e.position, position))

    const emoji = entity ? ICONS[entity.__type] : ICONS.blank

    const elementID = position.toString()
    document.getElementById(elementID).textContent = emoji
  })

  renderMoveCandidates(moveCandidates)
  renderMoveHistory(moveHistory)
  renderMoveTimer(lastMoveAt)
}

const initBoard = async () => {
  const state = await getState()
  render(state)
}

const initWs = () => {
  const ws = new WebSocket(BACKEND_WS_URL)
  ws.onmessage = (event) => {
    const state: State = JSON.parse(event.data)
    render(state)
  }
}

const initKeyListener = () => {
  document.addEventListener('keydown', handleKeyPress)
}

initBoard().then(() => {
  initWs()
  initKeyListener()
})
