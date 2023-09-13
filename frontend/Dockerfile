#FROM node:13.12.0-alpine as build
#
#WORKDIR /frontend
#COPY package.json .
#COPY package-lock.json .
#RUN npm install
#COPY . .
#RUN npm run build
# --- STAGE 1: install dependencies

FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /proj

COPY package.json package-lock.json ./

RUN npm install

# --- STAGE 2: build source code when needed

FROM node:20-alpine AS builder
WORKDIR /proj

COPY --from=deps /proj/node_modules ./node_modules

COPY . .

RUN npm run build

# --- STAGE 3: run production image
FROM node:20-alpine AS runner

WORKDIR /proj

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactjs

COPY --from=builder /proj/public ./public
COPY --from=builder /proj/package.json ./package.json
COPY --from=builder /proj/package-lock.json ./package-lock.json

USER reactjs

CMD ["npm", "start"]
