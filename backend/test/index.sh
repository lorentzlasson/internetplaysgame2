#!/bin/bash

export MOVE_SELECTION_MILLIS=500 # To speed up test

vite-node src &
pid=$!
echo "# NODE PROCESS STARTED - ${pid}"

echo "# WAIT FOR GAME SERVER TO START"
sleep 1 # Not very robust

echo "# RUN TEST"
NODE_NO_WARNINGS=1 vite-node test

echo "# KILL NODE PROCESS - ${pid}"
kill $pid
