import {
  State,
  MoveCandidate,
  Move,
  isSamePosition,
  range,
  HEIGHT,
  WIDTH,
  Direction,
  Entity,
  DEFAULT_MOVE_SELECTION_MILLIS,
} from '../../common'

const ICONS = {
  bomb: '💣',
  coin: '🪙',
  avatar: '🏃',
  blank: '⬜',
  timerBar: '🟩',
}

const KEY_DIRECTION_MAP: { [key: string]: Direction } = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

const MOVE_TIMER_MILLIS_RESOLUTION = 1000 // lower number = greater resolution

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
const BACKEND_WS_URL =
  import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:3000'

let lastMoveAtMillis: number | null = null

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

  const playerName = getPlayerName()
  if (!playerName) {
    alert('a player name needs to be entered before you can play')
    return
  }

  const state = await recordMove(playerName, direction)
  syncState(state)
}

const prettifyTime = (timeString: string) => {
  const time = new Date(timeString)
  return time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
}

const renderBoard = (entities: Entity[]) => {
  const table = document.getElementById('board')
  table.innerHTML = ''

  range(HEIGHT).forEach((y) => {
    const tr = document.createElement('tr')
    table.appendChild(tr)
    range(WIDTH).forEach((x) => {
      const entity = entities.find((e) => isSamePosition(e.position, [x, y]))
      const emoji = entity ? ICONS[entity.__type] : ICONS.blank

      const td = document.createElement('td')
      const cell = document.createTextNode(emoji)

      tr.appendChild(td)
      td.appendChild(cell)
    })
  })
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
  moveHistory.reverse().forEach(({ player: { name }, direction, time }) => {
    const line = prettifyTime(time) + ' | ' + name + ' moved ' + direction
    const node = document.createTextNode(line)
    const div = document.createElement('div')
    div.appendChild(node)
    element.appendChild(div)
  })
}

const renderMoveTimer = (millisLeft: number) => {
  if (millisLeft < 0) return

  const element = document.getElementById('moveTimer')
  element.innerHTML = ''

  const barCount = Math.ceil(millisLeft / MOVE_TIMER_MILLIS_RESOLUTION)
  range(barCount).forEach(() => {
    const node = document.createTextNode(ICONS.timerBar)
    element.appendChild(node)
  })
}

const syncState = async ({
  entities,
  score,
  highScore,
  moveCandidates,
  moveHistory,
  lastMoveAt,
}: State) => {
  document.getElementById('score').textContent = score.toString()
  document.getElementById('highScore').textContent = highScore.toString()

  renderBoard(entities)
  renderMoveCandidates(moveCandidates)
  renderMoveHistory(moveHistory)
  lastMoveAtMillis = new Date(lastMoveAt).getTime()
}

const initMoveTimer = () => {
  setInterval(() => {
    const now = new Date().getTime()
    const timePassed = now - lastMoveAtMillis
    const timeLeft = DEFAULT_MOVE_SELECTION_MILLIS - timePassed

    renderMoveTimer(timeLeft)
  }, MOVE_TIMER_MILLIS_RESOLUTION)
}

const initBoard = async () => {
  const state = await getState()
  syncState(state)
}

const initWs = () => {
  const ws = new WebSocket(BACKEND_WS_URL)
  ws.onmessage = (event) => {
    const state: State = JSON.parse(event.data)
    syncState(state)
  }
}

const initKeyListener = () => {
  document.addEventListener('keydown', handleKeyPress)
}

initBoard().then(() => {
  initWs()
  initKeyListener()
  initMoveTimer()
})
