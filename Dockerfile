## This dockerfile builds the client entirely in a Docker context
FROM node:18-alpine AS builder

ENV NODE_OPTIONS=--max-old-space-size=16384

# Set workdir
WORKDIR /src

# Install pnpm
RUN npm install -g pnpm@next-7

# Copy package.json & lockfile
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install and build
RUN pnpm install

# Copy all files from current directory to working dir in image
COPY . .

# build client
RUN pnpm build

# Deploy built distribution to nginx
FROM nginx:alpine

RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# set up root static content folder
WORKDIR /usr/share/nginx

# Copy nginx custom config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static assets from builder stage
COPY --from=builder ./src/dist ./html

VOLUME /usr/share/nginx/html
VOLUME /etc/nginx

EXPOSE 80

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
