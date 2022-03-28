<<<<<<< HEAD
FROM node:stretch-slim
MAINTAINER Reesey275 <reesey275@gmail.com>

ENV LAST_UPDATED 2020-16-06-2130
=======
FROM node:16-bullseye-slim

ENV LAST_UPDATED 2022-02-09-1815
>>>>>>> f4319510b65b494c411028d931efde68353f660d

ENV NODE_ENV production \
    ENV production \
    LOGS="/sogebot/logs" 

<<<<<<< HEAD
ARG VERSION=1.0.0

# Update apt and install Deps
# cwebp error while loading shared libraries: libGL.so.1: cannot open shared object file: No such file or directory
RUN apt-get -q update && \
    apt-get -q install -y \
    build-essential \
    nasm \
    libtool \
    make \
    bash \
    git \
    python \
    libglu1 \
    libxi6
=======
RUN apt-get update
RUN apt-get install -y build-essential nasm libtool make bash git autoconf wget zlib1g-dev python3
>>>>>>> f4319510b65b494c411028d931efde68353f660d

# Copy source code
COPY . /sogebot/app

# Change working directory
WORKDIR /sogebot/app

<<<<<<< HEAD
# Install dependencies & Remove dev dependencies (not needed anymore)
=======
# Install latest npm
RUN npm install -g npm@latest

# Install dependencies
>>>>>>> f4319510b65b494c411028d931efde68353f660d
RUN make
RUN npm prune --production
# Get latest ui dependencies in time of build
RUN npm update @sogebot/ui-admin @sogebot/ui-overlay @sogebot/ui-helpers @sogebot/ui-oauth @sogebot/ui-public

# Copy environment file to image. Not currently needed.
#COPY .env ./sogebot/app

# Storage Volume
VOLUME /sogebot/logs/

# Expose HTTP port to the outside
EXPOSE  20000
# Expose HTTPS port to the outside
EXPOSE  20443
# Expose profiler to the outside
EXPOSE  9229

#ADD bin/start.sh /sogebot/

# Supervisor
#ADD supervisor/ /etc/supervisor/conf.d/
#RUN sed -e 's,^logfile=.*$,logfile=/run/supervisord.log,' -i /etc/supervisor/supervisord.conf
#RUN sed -e 's,^chmod=.*$,chmod=0760\nchown=cloudron:cloudron,' -i /etc/supervisor/supervisord.conf


# Add startup script
COPY docker.sh /
RUN chmod +x /docker.sh
ENTRYPOINT ["/docker.sh"]