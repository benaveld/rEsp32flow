FROM petewall/platformio:latest

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
  curl \
  git \
  nodejs \
  && rm -rf /var/lib/apt/lists/*

RUN pio upgrade \
  && pio pkg install -g -p espressif32 \
  && pio system prune -f

RUN mkdir -p /etc/udev/rules.d \
  && curl -fsSL https://raw.githubusercontent.com/platformio/platformio-core/master/scripts/99-platformio-udev.rules > /etc/udev/rules.d/99-platformio-udev.rules 

ENTRYPOINT [ "/bin/sh" ] 