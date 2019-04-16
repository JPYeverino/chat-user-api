#STAGE 1 BUILD CODE
FROM node:10-alpine as build
LABEL author="JPYeverino"
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#STAGE 2
FROM node:10-alpine
RUN npm install --production

COPY --from=build /src/tsconfig.json /opt/app/tsconfig.json
COPY --from=build /src/tslint.json /opt/app/tslint.json
COPY --from=build /src/config /opt/app/config
COPY --from=build /src/dist /opt/app
COPY --from=build /src/node_modules /opt/app/node_modules
WORKDIR /opt/app

RUN npm install pm2 -g

ENTRYPOINT ["pm2-runtime", "main.js"]