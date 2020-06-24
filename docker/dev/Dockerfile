FROM node:14
WORKDIR /src

# Copy and install dependencies to cache layer.
COPY ./package.json ./
RUN yarn
