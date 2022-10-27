import { serve } from "./dep.ts";
import { executeNextMove, getState, recordMove } from "./game.ts";

import { isDirection } from "./common.ts";
import ui from "./ui/main.tsx";

const PORT = 8000;

executeNextMove(() => {});

await serve(
  async (req) => {
    if (req.method === "GET") {
      const state = getState();
      const html = ui(state);
      return new Response(html, {
        headers: {
          "content-type": "text/html",
        },
      });
    }

    if (req.method === "POST") {
      const formData = await req.formData();
      const playerName = formData.get("playerName");
      const direction = formData.get("direction");
      if (playerName) {
        if (isDirection(direction)) {
          recordMove(direction, playerName.toString());

          const state = getState();
          const html = ui(state);

          return new Response(html, {
            headers: {
              "content-type": "text/html",
            },
          });
        }
      }

      return new Response(null, { status: 400 });
    }

    return new Response(null, { status: 405 });
  },
  { port: PORT },
);
