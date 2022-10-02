import { State } from '../../common'

const ICONS = {
  bomb: '💣',
  coin: '🪙',
  avatar: '🏃',
}

const f = async () => {
  try {
    const { entities, score }: State = await fetch(
      'http://localhost:3000'
    ).then((x) => x.json())

    document.getElementById('score').textContent = score.toString()

    entities.forEach(({ position, __type }) => {
      const pos = position.toString()
      const emoji = ICONS[__type]

      document.getElementById(pos).textContent = emoji
    })
  } catch (error) {
    console.error(error)
  }

  setTimeout(() => {
    location.reload()
  }, 1000)
}

f()
