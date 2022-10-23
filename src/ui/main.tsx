import { React, ReactDOMServer } from "../dep.ts";
import { HEIGHT, isSamePosition, range, State, WIDTH } from "../common.ts";

const ICONS = {
  bomb: "💣",
  coin: "🪙",
  avatar: "🏃",
  blank: "⬜",
  timerBar: "🟩",
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
                const emoji = entity ? ICONS[entity.__type] : ICONS.blank;
                return (
                  <td>
                    {emoji}
                  </td>
                );
              })}
            </tr>
          ))}
        </table>
      </div>
    </body>
  </html>
);

export default (state: State) => ReactDOMServer.renderToString(ui(state));
