
# --- STAGE 1: Install Dependencies and Build React App

FROM node:14 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY src .
RUN npm start build

# --- STAGE 2: Serve React App

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html