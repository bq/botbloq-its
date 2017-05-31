# Mongodb 
# docker run -d --name my-mongodb mongo
# Nodeapp (backend)
# build:
# docker build -t botbloq/botbloq-its .
# run:
# docker run -p 8000:8000 --link my-mongodb:mongo --name nodeapp botbloq/botbloq-its
# test:
# curl http://localhost:8000/botbloq/v1/its/students

FROM node:4.4.2

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8000
CMD [ "npm", "start" ]