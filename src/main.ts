import { serve } from 'https://deno.land/std@0.160.0/http/server.ts'
import { getState } from './game.ts'
import ui from './ui/main.tsx'

const PORT = 8000

const x = getState()

await serve(
  (req) => {
    if (req.method === 'GET') {
      const res = ui(x)
      return new Response(res, {
        headers: {
          'content-type': 'text/html',
        },
      })
    }

    if (req.method === 'POST') {
      return new Response(null, { status: 405 })
    }

    return new Response(null, { status: 405 })
  },
  { port: PORT }
)

console.log(`App listening on port ${PORT}`)
