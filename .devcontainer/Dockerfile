# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.234.0/containers/alpine/.devcontainer/base.Dockerfile

# [Choice] Alpine version: 3.14, 3.13, 3.12, 3.11
ARG VARIANT="3.15"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-alpine-${VARIANT}

ARG WORKSPACE="/rEsp32flow"
WORKDIR ${WORKSPACE}

RUN apk update \
  && apk upgrade \
  && apk -q add --no-cache \
    clang-extra-tools \
    gcompat \
    npm \
    py3-pip \
    python3 \
  && pip install -U platformio \
  && npm i -g npm-check-updates 

COPY pio-setup.sh /tmp/pio-setup.sh
RUN sudo -n -u vscode ash /tmp/pio-setup.sh \
  && rm /tmp/pio-setup.sh

RUN mkdir -p /etc/udev/rules.d/ \
  && curl -fsSL https://raw.githubusercontent.com/platformio/platformio-core/master/scripts/99-platformio-udev.rules > /etc/udev/rules.d/99-platformio-udev.rules

# add user to device group so it might access the dev board and set the shell to zsh
RUN usermod -a -G dialout -s $(which zsh) vscode \
  && mkdir -p .pio data website/node_modules \
  && chown -R vscode:vscode .pio data website/node_modules