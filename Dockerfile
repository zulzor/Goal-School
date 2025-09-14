# Dockerfile - для продакшена
FROM node:16-alpine AS builder

# Установка зависимостей для node-gyp
RUN apk add --no-cache python3 make g++

# Создание директории приложения
WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci --only=production

# Копирование исходного кода
COPY . .

# Сборка веб-версии приложения
RUN npm run build

# Production stage
FROM node:16-alpine

# Создание директории приложения
WORKDIR /app

# Копирование зависимостей из builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/web-build ./web-build

# Создание non-root пользователя
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Изменение владельца файлов
RUN chown -R nextjs:nodejs /app
USER nextjs

# Экспозиция порта
EXPOSE 3000

# Команда для запуска приложения
CMD ["node", "server.js"]