import { isAvatar, isBomb, isCoin } from '../../common'
import {
  assertEntityIsInPosition,
  assertPlayerCount,
  assertScore,
  assertEntityIsNotInPosition,
  assertMoveCount,
  assertHighscore,
  waitForMoveExecution,
  recordMoves,
  logState,
} from './util'

const runFlow = async () => {
  // Verify initial state
  await Promise.all([
    assertEntityIsInPosition(isAvatar, [0, 2]),
    assertEntityIsInPosition(isCoin, [2, 0]),
    assertEntityIsInPosition(isBomb, [0, 1]),
    assertScore(0),
  ])

  await recordMoves([
    ['a', 'right'],
    ['b', 'right'],
  ])
  await waitForMoveExecution()

  await recordMoves([
    ['a', 'right'],
    ['b', 'right'],
  ])
  await waitForMoveExecution()

  await recordMoves([
    ['a', 'up'],
    ['b', 'up'],
  ])
  await waitForMoveExecution()

  await recordMoves([
    ['a', 'up'],
    ['b', 'up'],
  ])
  await waitForMoveExecution()

  await Promise.all([
    // Coin is collected
    assertScore(1),
    // Coin has respawned in new location location
    assertEntityIsNotInPosition(isCoin, [2, 0]),
  ])

  // tries to go out of bounds
  await recordMoves([
    ['a', 'up'],
    ['c', 'up'],
  ])
  await waitForMoveExecution()

  await recordMoves([
    ['a', 'left'],
    ['c', 'left'],
  ])
  await waitForMoveExecution()

  await recordMoves([
    ['a', 'down'],
    ['c', 'down'],
  ])
  await waitForMoveExecution()

  await recordMoves([
    ['a', 'left'],
    ['c', 'left'],
  ])
  await waitForMoveExecution()

  await Promise.all([
    // Bomb is blown up, reseting score to 0
    // (Score might have gone up over 1 before bomb explosion depending on randomized respawn location on coin)
    assertScore(0),

    // Avatar is in position where bomb was previously
    assertEntityIsInPosition(isAvatar, [0, 1]),
    // Bomb has respawned in new location location
    assertEntityIsNotInPosition(isBomb, [0, 1]),

    assertPlayerCount(3),
    assertMoveCount(7),
    assertHighscore([1, 2, 3]),
  ])

  if (process.env.VERBOSE) await logState()

  console.log('TEST PASS')
}

runFlow()
