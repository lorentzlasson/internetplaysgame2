import { serve } from 'https://deno.land/std@0.160.0/http/server.ts'
import ui from './ui/main.tsx'

const PORT = 8000

await serve(
  (req) => {
    const { searchParams: query } = new URL(req.url)
    const name = query.get('name') || 'world'
    const res = ui(name)
    return new Response(res, {
      headers: {
        'content-type': 'text/html',
      },
    })
  },
  { port: PORT }
)

console.log(`App listening on port ${PORT}`)
