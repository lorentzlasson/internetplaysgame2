#!/bin/bash

kysely-codegen \
  --dialect postgres \
  --exclude-pattern refinery_schema_history \
  --out-file ./output/db.types.ts
