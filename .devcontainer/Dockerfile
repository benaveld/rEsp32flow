FROM alpine:3

RUN apk -q add \
    doas \
    gcompat \
    git \
    npm \
    openssh-client \
    py3-pip \
  && pip install -U platformio \
  && npm i -g npm-check-updates 

# Setup a non-root user named "dev"
ARG USERNAME=dev
ARG USER_UID=1000
ARG PASSWORD=123

RUN adduser --disabled-password -u $USER_UID -G users $USERNAME \
  && adduser $USERNAME dialout \
  && adduser $USERNAME uucp \
  && adduser $USERNAME wheel \
  && echo "permit persist :wheel" >> /etc/doas.d/doas.conf \
  && echo "root:$PASSWORD"|chpasswd \
  && echo "$USERNAME:$PASSWORD"|chpasswd 

USER $USERNAME

RUN pio pkg install -g \
  -p espressif32 \
  && pio system prune -f