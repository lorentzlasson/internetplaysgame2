import { State, isSamePosition, POSITIONS, Direction } from '../../common'

const ICONS = {
  bomb: '💣',
  coin: '🪙',
  avatar: '🏃',
  blank: '⬜',
}

const MOVE_KEYS: { [key: string]: Direction } = {
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
}

const getState = async (): Promise<State> =>
  fetch('http://localhost:3000').then((x) => x.json())

const recordMove = async (playerName: string, direction: Direction) =>
  fetch(`http://localhost:3000/${playerName}/${direction}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((x) => x.json())

const handleKeyPress = async ({ key }: KeyboardEvent) => {
  const direction = MOVE_KEYS[key]
  if (!direction) return
  const state = await recordMove('default', direction)
  console.log(state)
}

const rerender = async () => {
  const { entities, score }: State = await getState()

  document.getElementById('score').textContent = score.toString()

  POSITIONS.forEach((position) => {
    const entity = entities.find((e) => isSamePosition(e.position, position))

    const emoji = entity ? ICONS[entity.__type] : ICONS.blank

    const elementID = position.toString()
    document.getElementById(elementID).textContent = emoji
  })
}

const f = async () => {
  try {
    await rerender()
  } catch (error) {
    console.error(error)
  }
  setTimeout(f, 1000)
}

document.addEventListener('keypress', handleKeyPress)

f()
