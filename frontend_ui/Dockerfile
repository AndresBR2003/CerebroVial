# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código y construir
COPY . .
RUN npm run build

# Etapa 2: Servidor de producción (ligero)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80 dentro del contenedor
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
