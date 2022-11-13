import {
  Kysely,
  Generated,
} from "https://cdn.jsdelivr.net/npm/kysely/dist/esm/index.js";
import { PostgresDialect } from "https://deno.land/x/kysely_postgres/mod.ts";

type MovieTable = {
  id: Generated<string>;
  stars: number;
};

type Database = {
  movie: MovieTable;
};

console.log(Deno.env.get("POSTGRES_PASSWORD"));

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    user: "postgres",
    database: "postgres",
    hostname: "localhost",
  }),
});
console.log({ db });

const x = await db.selectFrom("foo").execute();

console.log({ x });
