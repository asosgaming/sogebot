FROM node:stretch-slim
MAINTAINER Chad Reesey <chad.reesey@asosgaming.com>

ENV LAST_UPDATED 2020-11-05-1440

ENV NODE_ENV production \
    ENV production \
    LOG="/app/" 

RUN apt-get update
RUN apt-get install -y build-essential nasm libtool make bash git python

# cwebp error while loading shared libraries: libGL.so.1: cannot open shared object file: No such file or directory
RUN apt-get install -y libglu1 libxi6

# Copy source code
COPY . /app

# Change working directory
WORKDIR /app

# Install dependencies
RUN make
# Remove dev dependencies (not needed anymore)
RUN npm prune --production

# Expose API port to the outside
EXPOSE 20000

# Expose API port to the outside
EXPOSE 20443

# Expose profiler to the outside
EXPOSE 9229

# Add startup script
COPY docker.sh /
RUN chmod +x /docker.sh
ENTRYPOINT ["/docker.sh"]