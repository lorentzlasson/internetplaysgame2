FROM denoland/deno:1.26.2

WORKDIR /app

COPY src .

RUN deno cache dep.ts

CMD deno run \
      --allow-net \
      --allow-read \
      --allow-env \
      main.ts

