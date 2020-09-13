#!/bin/bash

export CURR_DIR=$(pwd)
cd src/github.com/pakflame
rm -vfr vendor
cd "$CURR_DIR"


docker build .
