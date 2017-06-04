FROM node:8

ENV DIR_PATH=/root

COPY . $DIR_PATH
WORKDIR $DIR_PATH

RUN npm i

ENTRYPOINT ["node"]
CMD ["app.js"]
