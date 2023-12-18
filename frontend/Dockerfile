###########
# BUILDER #
###########
FROM node:lts-slim as builder

COPY package.json package-lock.json ./

RUN npm install && mkdir /react-frontend && mv ./node_modules ./react-frontend
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL
WORKDIR /react-frontend

COPY . .

RUN npm run build

#########
# FINAL #
#########
FROM nginx:1.19.2-alpine

COPY --from=builder /react-frontend/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
