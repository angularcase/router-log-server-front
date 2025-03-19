# Etap budowania Angulara
FROM node:18-alpine as build
WORKDIR /app

# Kopiowanie plików konfiguracyjnych i instalacja zależności
COPY package*.json ./
RUN npm install

# Kopiowanie reszty plików projektu
COPY . .

# Budowanie projektu Angular z przekazaniem flagi --prod
RUN npm run build -- --configuration production

# Etap produkcyjny - serwowanie plików za pomocą Nginx
FROM nginx:alpine
# Upewnij się, że ścieżka /app/dist/<nazwa_projektu> odpowiada Twojemu folderowi wynikowemu
COPY --from=build /app/dist/my-app/browser /usr/share/nginx/html

# Wystawienie portu 3536
EXPOSE 3536

# Zmiana domyślnej konfiguracji Nginx, aby nasłuchiwał na porcie 3536
RUN sed -i 's/listen       80;/listen       3536;/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]