FROM denoland/deno:1.26.2

WORKDIR /app

COPY src ./src
COPY deno.jsonc .

RUN deno cache src/dep.ts

CMD deno task dev

