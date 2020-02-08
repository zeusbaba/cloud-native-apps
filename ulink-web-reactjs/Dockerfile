# the base image for this is an alpine based nginx image
FROM nginx:alpine
LABEL maintainer="Zeus Baba 397125+zeusbaba@users.noreply.github.com"

ENV APP_HOME=/usr/src/app
ENV APP_PORT=4048

RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

# copy the build folder from react to the root of nginx (www)
COPY build /usr/share/nginx/html
# --------- only for those using react router ----------
# if you are using react router
# you need to overwrite the default nginx configurations
# remove default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d
# --------- /only for those using react router ----------

EXPOSE ${APP_PORT}
# start nginx
CMD ["nginx", "-g", "daemon off;"]
