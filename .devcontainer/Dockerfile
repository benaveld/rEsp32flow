FROM petewall/platformio:latest

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
  curl \
  git \
  nodejs \
  npm \
  sudo \
  && rm -rf /var/lib/apt/lists/*

RUN pio upgrade \
  && pio pkg install -g -p espressif32 \
  && pio system prune -f

RUN mkdir -p /etc/udev/rules.d \
  && curl -fsSL https://raw.githubusercontent.com/platformio/platformio-core/master/scripts/99-platformio-udev.rules > /etc/udev/rules.d/99-platformio-udev.rules 

# Setup a non-root user named "dev"
ARG USERNAME=dev
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG DEVICE_GROUP=dialout,uucp

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME -G sudo,$DEVICE_GROUP \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# [Optional] Set the default user. Omit if you want to keep the default as root.
USER $USERNAME

ENTRYPOINT [ "/bin/bash" ] 