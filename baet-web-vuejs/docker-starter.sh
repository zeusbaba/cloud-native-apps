#!/usr/bin/env sh

## Initialization logic...
# source the file so that vars become available in the current shell
. ./import-env-vars.sh

## Starting the App
echo "starting Node.js app..."
# The $* allows me to pass command line arguments that were passed to the docker run command.
./wait && npm serve $*

## (optional) Cleanup logic can go here
