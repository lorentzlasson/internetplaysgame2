#!/bin/bash

vite-node src &
pid=$!
echo "# NODE PROCESS STARTED - ${pid}"

echo "# WAIT FOR GAME SERVER TO START"
sleep 1 # Not very robust

echo "# RUN TEST"
vite-node test

echo "# KILL NODE PROCESS - ${pid}"
kill $pid
