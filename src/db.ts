import { Kysely } from "https://cdn.jsdelivr.net/npm/kysely/dist/esm/index.js";
import { PostgresDialect } from "https://deno.land/x/kysely_postgres@v0.0.3/mod.ts";
import { DB } from "./db.types.ts";

console.log(Deno.env.get("POSTGRES_PASSWORD"));

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    user: "postgres",
    database: "postgres",
    hostname: "localhost",
  }),
});
console.log({ db });

const x = await db.selectFrom("player").execute();

console.log({ x });
