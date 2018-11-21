FROM node:10-alpine
MAINTAINER Yilmaz Guleryuz 397125+zeusbaba@users.noreply.github.com

#USER node
ENV HOME=/home/node

# optionally if you want to run npm global bin without specifying path
ENV NPM_CONFIG_PREFIX=$HOME/.npm-global
ENV PATH=$PATH:$HOME/.npm-global/bin

RUN mkdir -p $HOME/app
#RUN chown -R node.node $HOME/app
WORKDIR $HOME/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm config set strict-ssl false
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

## used to check if DB is up
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.4.0/wait /wait
RUN chmod +x /wait

# Bundle app source
COPY . .

EXPOSE 4042

#CMD [ "npm", "start" ]
CMD /wait && npm start
