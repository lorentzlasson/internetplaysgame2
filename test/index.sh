#!/bin/bash

export COMPOSE_FILE=compose.yaml:compose.test.yaml

# Used both by game server and test runner.
# Increase if test gets flaky
export MOVE_SELECTION_MILLIS=300

SERVICE=game

echo "# STARTING GAME SERVER IN CONTAINER"
docker compose up --detach $SERVICE

echo "# WAIT FOR GAME SERVER TO START"
sleep 1 # Not very robust

echo "# RUN TEST"
deno task test

if [ -n "$DEBUG" ]; then
  docker compose logs $SERVICE
fi

echo "# KILL NODE SERVER"
docker compose rm --stop --force $SERVICE 2> /dev/null
