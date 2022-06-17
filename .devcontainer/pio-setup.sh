#!/bin/ash

pio pkg install -g \
  -p espressif32

pio system prune -f