FROM node:stretch-slim
MAINTAINER Reesey275 <reesey275@gmail.com>

ENV LAST_UPDATED 2020-16-06-2130

ENV NODE_ENV production \
    ENV production \
    LOGS="/app/logs" 



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

# Copy source code
COPY . /app

# Change working directory
WORKDIR /app

# Install dependencies & Remove dev dependencies (not needed anymore)
RUN make
RUN npm prune --production

# Storage Volume
#LOGS="/app/logs" 
#VOLUME ["$LOGS"]
VOLUME /app/logs/

# Expose HTTP port to the outside
EXPOSE  20000
# Expose HTTPS port to the outside
EXPOSE  20443
# Expose profiler to the outside
EXPOSE  9229

# Add startup script
COPY docker.sh /
RUN chmod +x /docker.sh
ENTRYPOINT ["/docker.sh"]