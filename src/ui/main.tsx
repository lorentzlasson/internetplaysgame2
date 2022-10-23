/** @jsx h */
import { h, renderToString } from "../dep.ts";

import {
  Direction,
  HEIGHT,
  isSamePosition,
  range,
  State,
  WIDTH,
} from "../common.ts";

const EMOJI = {
  bomb: "💣",
  coin: "🪙",
  avatar: "🏃",
  blank: "⬜",
  timerBar: "🟩",
};

const DIRECTION_EMOJI_MAP: { [key in Direction]: string } = {
  left: "⬅️",
  down: "⬇️",
  up: "⬆️",
  right: "➡️",
};

const prettifyTime = (timeString: string) => {
  const time = new Date(timeString);
  return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
};

const ui = (state: State) => (
  <html>
    <head>
      <title>Internet Plays Game</title>
      <meta charSet="UTF-8"></meta>
    </head>
    <body style={{ display: "flex", overflow: "hidden" }}>
      <div>
        <table style={{ fontSize: "100px" }}>
          {range(HEIGHT).map((y) => (
            <tr>
              {range(WIDTH).map((x) => {
                const entity = state.entities.find((e) =>
                  isSamePosition(e.position, [x, y])
                );
                const emoji = entity ? EMOJI[entity.__type] : EMOJI.blank;
                return (
                  <td>
                    {emoji}
                  </td>
                );
              })}
            </tr>
          ))}
        </table>
        <table>
          {state.moveHistory.reverse().map(
            ({ player: { name }, direction, time }) => (
              <tr>
                <td>{prettifyTime(time)}</td>
                <td>{name}</td>
                <td>{DIRECTION_EMOJI_MAP[direction]}</td>
              </tr>
            ),
          )}
        </table>
      </div>
      <div>
        <div style={{ fontSize: "20px" }}>
          <div>
            {state.lastMoveAt
              ? `Last move at ${prettifyTime(state.lastMoveAt)}`
              : ""}
          </div>
          <div style={{ display: "flex" }}>
            🪙<div>{state.score}</div>
          </div>
          <div style={{ display: "flex" }}>
            🥇<div>{state.highScore}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
          }}
        >
          <form method="POST">
            <input
              type="text"
              placeholder="player name"
              style={{ fontSize: "inherit" }}
              name="playerName"
              required
              autoFocus
            >
            </input>

            <div
              style={{
                display: "flex",
              }}
            >
              {Object.entries(DIRECTION_EMOJI_MAP).map(([direction, emoji]) => {
                return (
                  <input
                    value={emoji}
                    formAction={direction}
                    type="submit"
                    style={{ flex: 1 }}
                  >
                  </input>
                );
              })}
            </div>
          </form>
        </div>
        <div style={{ borderTop: "solid" }}>
          {state.moveCandidates.map(({ player: { name }, direction }) => (
            <div>
              {`${name} wants to move ${DIRECTION_EMOJI_MAP[direction]}`}
            </div>
          ))}
        </div>
      </div>
    </body>
  </html>
);

export default (state: State) => renderToString(ui(state));
