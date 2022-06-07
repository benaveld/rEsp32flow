# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.234.0/containers/alpine/.devcontainer/base.Dockerfile

# [Choice] Alpine version: 3.14, 3.13, 3.12, 3.11
ARG VARIANT="3.15"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-alpine-${VARIANT}

RUN apk update \
  && apk -q add --no-cache \
    bash-completion \
    curl \
    gcompat \
    npm \
    openssh-client \
    py3-pip \
  && pip install -U platformio \
  && npm i -g npm-check-updates 

# Enable bash-completion for users root and vscode
ARG BACH_COMPLETION="[ -r /usr/share/bash-completion/bash_completion ] && . /usr/share/bash-completion/bash_completion" 
RUN echo $BACH_COMPLETION >> /root/.bashrc \
  && echo $BACH_COMPLETION >> /home/vscode/.bashrc

RUN mkdir -p /etc/udev/rules.d/ \
  && curl -fsSL https://raw.githubusercontent.com/platformio/platformio-core/master/scripts/99-platformio-udev.rules > /etc/udev/rules.d/99-platformio-udev.rules

USER vscode

RUN pio pkg install -g \
  -p espressif32 \
  && pio system prune -f