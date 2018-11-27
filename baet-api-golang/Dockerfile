FROM alpine:3.8
LABEL maintainer="Yilmaz Guleryuz 397125+zeusbaba@users.noreply.github.com"

ENV APP_HOME=/usr/src/app

RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

ENV ENV_IMPORTER=import-env-vars.sh
COPY $ENV_IMPORTER .
RUN chmod +x ./$ENV_IMPORTER

# use a unified script to run the app
ENV DOCKER_STARTER=docker-starter.sh
COPY $DOCKER_STARTER .
RUN chmod +x ./$DOCKER_STARTER

# copy executable prepared via go build
COPY baet-api-golang ./
RUN chmod +x ./baet-api-golang

## used to check if DB is up
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.4.0/wait ./wait
RUN chmod +x ./wait

EXPOSE 4042

ENTRYPOINT exec ./${DOCKER_STARTER}
