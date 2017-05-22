#!/usr/bin/env bash
set -e

RUN_CMD=$1
INPUT_FILE=$2
EXPECTED_BUNDLES=$3

if [ $# -ne 3 ]; then
  echo "Not enough arguments"
  echo
  echo "Usage:"
  echo
  echo "  $0 \"quoted run command\" some/input/file number_of_bundles_expected"
  echo
  exit 1
fi

# So we can reuse this script from a different relative path
VALIDATE_CMD=${VALIDATE_CMD:-"node validate.js"}

echo "Running a test against $INPUT_FILE (expecting $EXPECTED_BUNDLES bundles)"

`$RUN_CMD "$INPUT_FILE" > "$INPUT_FILE".out`
$VALIDATE_CMD "$INPUT_FILE" "$INPUT_FILE.out" $EXPECTED_BUNDLES
