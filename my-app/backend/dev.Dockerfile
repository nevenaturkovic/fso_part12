FROM node:16

WORKDIR /usr/src/app

EXPOSE 3000

CMD ./install_and_start.sh
