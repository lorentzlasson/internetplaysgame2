#!/bin/bash

echo "# STARTING GAME SERVER IN CONTAINER"
docker compose up test-server -d

echo "# WAIT FOR GAME SERVER TO START"
sleep 1 # Not very robust

echo "# RUN TEST"
MOVE_SELECTION_MILLIS=500 npm test

if [ -n "$VERBOSE" ]; then
  docker compose logs
fi

echo "# KILL NODE SERVER"
docker compose rm --stop --force test-server 2> /dev/null
