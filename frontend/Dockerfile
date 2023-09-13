# Используем официальный образ Node.js в качестве базового образа
FROM node:14

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /frontend

# Копируем файлы package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы проекта в контейнер
COPY . .

# Собираем приложение для production
RUN npm run build

# Устанавливаем сервер для статических файлов (по желанию)
# RUN npm install -g serve

# Определяем команду для запуска приложения
CMD ["npm", "start"]


# --- STAGE 1: install dependencies
#
#FROM node:20-alpine AS deps
#
#RUN apk add --no-cache libc6-compat
#
#WORKDIR /proj
#
#COPY package*.json ./
#
#RUN npm install
#RUN npm install react-scripts --save
#
## --- STAGE 2: build source code when needed
#
#FROM node:20-alpine AS builder
#WORKDIR /proj
#
#COPY --from=deps /proj/node_modules ./node_modules
#
#COPY . .
#
#RUN npm run build
#
## --- STAGE 3: run production image
#FROM node:20-alpine AS runner
#
#WORKDIR /proj
#
#RUN addgroup --system --gid 1001 nodejs
#RUN adduser --system --uid 1001 reactjs
#
#COPY --from=builder /proj/public ./public
#COPY --from=builder /proj/package.json ./package.json
#COPY --from=builder /proj/package-lock.json ./package-lock.json
#
#USER reactjs
#
#CMD ["npm", "start"]
