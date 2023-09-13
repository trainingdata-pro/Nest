###########
# BUILDER #
###########
FROM node:lts-slim as builder

COPY package.json package-lock.json ./
RUN npm install && mkdir /frontend && mv ./node_modules ./frontend

WORKDIR /frontend
COPY . .

RUN npm run build

#########
# FINAL #
#########
FROM nginx:1.19.2-alpine
COPY --from=builder /frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]