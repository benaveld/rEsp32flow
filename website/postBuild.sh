#!/bin/bash

ENV_FILE=.env
export "$(grep -v '^#' $ENV_FILE)"

# Path is to long for SPIFFS (In esp32) to handle.
rm "$BUILD_PATH/static/js/main.*.js.LICENSE.txt"