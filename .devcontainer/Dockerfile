FROM petewall/platformio:latest

RUN pio platform install espressif32
RUN apt-get update && apt-get install \
  curl \
  git \
  && apt-get clean

RUN mkdir -p /etc/udev/rules.d \
  && curl -fsSL https://raw.githubusercontent.com/platformio/platformio-core/master/scripts/99-platformio-udev.rules > /etc/udev/rules.d/99-platformio-udev.rules 

ENTRYPOINT [ "/bin/sh" ] 