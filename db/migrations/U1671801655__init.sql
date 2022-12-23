create sequence "public"."entity_id_seq";

create sequence "public"."game_id_seq";

create sequence "public"."move_candiate_id_seq";

create sequence "public"."move_id_seq";

create sequence "public"."player_id_seq";

create domain entity_type as text check(value in (
  'avatar',
  'coin',
  'bomb'
));

create domain direction as text check(value in (
  'up',
  'down',
  'left',
  'right'
));

create domain positive_number as integer not null check (
  value >= 0
);

create domain width as integer not null check (
  value >= 0 and value <= 2
);

create domain height as integer not null check (
  value >= 0 and value <= 2
);

create domain movement_range as integer not null check (
  value >= -1 and value <= 1
);

create type "public"."movement" as ("x" movement_range, "y" movement_range);

create type "public"."position" as ("width" width, "height" height);

create table "public"."game" (
    "id" integer not null default nextval('game_id_seq'::regclass),
    "score" positive_number not null default 0,
    "last_move_at" timestamp with time zone,
    "high_score" positive_number not null default 0
);

create table "public"."player" (
    "id" integer not null default nextval('player_id_seq'::regclass),
    "game_id" integer not null,
    "name" text not null
);

create table "public"."entity" (
    "id" integer not null default nextval('entity_id_seq'::regclass),
    "game_id" integer not null,
    "type" entity_type not null,
    "position" "position" not null
);

create table "public"."move" (
    "id" integer not null default nextval('move_id_seq'::regclass),
    "game_id" integer not null,
    "direction" direction not null,
    "player" player not null,
    "time" timestamp with time zone not null default now()
);

create table "public"."move_candiate" (
    "id" integer not null default nextval('move_candiate_id_seq'::regclass),
    "game_id" integer not null,
    "direction" direction not null,
    "player" player not null
);



alter sequence "public"."entity_id_seq" owned by "public"."entity"."id";

alter sequence "public"."game_id_seq" owned by "public"."game"."id";

alter sequence "public"."move_candiate_id_seq" owned by "public"."move_candiate"."id";

alter sequence "public"."move_id_seq" owned by "public"."move"."id";

alter sequence "public"."player_id_seq" owned by "public"."player"."id";

CREATE UNIQUE INDEX entity_pkey ON public.entity USING btree (id);

CREATE UNIQUE INDEX game_pkey ON public.game USING btree (id);

CREATE UNIQUE INDEX move_candiate_pkey ON public.move_candiate USING btree (id);

CREATE UNIQUE INDEX move_pkey ON public.move USING btree (id);

CREATE UNIQUE INDEX player_pkey ON public.player USING btree (id);

alter table "public"."entity" add constraint "entity_pkey" PRIMARY KEY using index "entity_pkey";

alter table "public"."game" add constraint "game_pkey" PRIMARY KEY using index "game_pkey";

alter table "public"."move" add constraint "move_pkey" PRIMARY KEY using index "move_pkey";

alter table "public"."move_candiate" add constraint "move_candiate_pkey" PRIMARY KEY using index "move_candiate_pkey";

alter table "public"."player" add constraint "player_pkey" PRIMARY KEY using index "player_pkey";

alter table "public"."entity" add constraint "entity_game_id_fkey" FOREIGN KEY (game_id) REFERENCES game(id) not valid;

alter table "public"."entity" validate constraint "entity_game_id_fkey";

alter table "public"."game" add constraint "game_check" CHECK (((high_score)::integer >= (score)::integer)) not valid;

alter table "public"."game" validate constraint "game_check";

alter table "public"."move" add constraint "move_game_id_fkey" FOREIGN KEY (game_id) REFERENCES game(id) not valid;

alter table "public"."move" validate constraint "move_game_id_fkey";

alter table "public"."move_candiate" add constraint "move_candiate_game_id_fkey" FOREIGN KEY (game_id) REFERENCES game(id) not valid;

alter table "public"."move_candiate" validate constraint "move_candiate_game_id_fkey";

alter table "public"."player" add constraint "player_game_id_fkey" FOREIGN KEY (game_id) REFERENCES game(id) not valid;

alter table "public"."player" validate constraint "player_game_id_fkey";


