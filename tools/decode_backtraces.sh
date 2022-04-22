#!/bin/bash
python tools/decoder.py -pESP32 -t/home/$USER/.platformio/packages/toolchain-xtensa32 -e.pio/build/esp32dev/firmware.elf  $1