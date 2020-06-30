FROM node:stretch-slim

ENV LAST_UPDATED 2020-11-05-1440

ENV NODE_ENV production \
    ENV production \
    LOGS="/app/sogebot/logs" 

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

# Copy environment file to image. Not currently needed.
#COPY .env ./sogebot/app

# Storage Volume
VOLUME /app/logs/

# Expose HTTP port to the outside
EXPOSE  20000
# Expose HTTPS port to the outside
EXPOSE  20443
# Expose profiler to the outside
EXPOSE  9229

## Cloudron config settings
#ADD bin/start.sh /sogebot/
# Supervisor
#ADD supervisor/ /etc/supervisor/conf.d/
#RUN sed -e 's,^logfile=.*$,logfile=/run/supervisord.log,' -i /etc/supervisor/supervisord.conf
#RUN sed -e 's,^chmod=.*$,chmod=0760\nchown=cloudron:cloudron,' -i /etc/supervisor/supervisord.conf


# Add startup script
COPY docker.sh /
RUN chmod +x /docker.sh
ENTRYPOINT ["/docker.sh"]