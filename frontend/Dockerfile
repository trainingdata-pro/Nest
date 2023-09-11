# Устанавливаем базовый образ Node.js
FROM node:14

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы из текущей директории в контейнер
COPY . .

# Собираем React-приложение
RUN npm build

# Команда для запуска приложения, если это необходимо
CMD ["npm", "start"]