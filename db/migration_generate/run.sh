#!/bin/bash

if [ -z $NAME ]; then
  echo "NAME missing"
  exit
fi

if tusker check > /dev/null; then
  echo $?
  echo "No changed detected"
  exit
fi

echo $?

# TODO abort on syntax error

tusker diff > migrations/U$(date +%s)__$NAME.sql
