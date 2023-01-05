FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

# Install dependencies
RUN yarn install --frozen-lockfile --production

# Add required assets
COPY www www
COPY app.js app.js

EXPOSE 8080

CMD ["yarn", "start"]
