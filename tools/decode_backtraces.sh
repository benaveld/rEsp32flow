#!/bin/bash
python3 "$(dirname "$0")"/EspArduinoExceptionDecoder/decoder.py -p ESP32 -t $HOME/.platformio/packages/toolchain-xtensa-esp32 -e "$(dirname "$0")"/../.pio/build/esp32dev/firmware.elf $@