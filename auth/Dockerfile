FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
# we have COPY . ., copying our index.ts file because if we make a change to that file
# we would only build this container again, we dont want to have to run npm install again
# would only detect the changes I made in the index.ts file
COPY . .

CMD ["npm", "start"]