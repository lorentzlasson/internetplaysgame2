type Position = [number, number]

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

const ICONS = {
  bomb: '💣',
  coin: '🪙',
  avatar: '🏃',
}

type State = { entities: Entity[]; score: number }

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
