#!/bin/sh

# Đợi cho MySQL sẵn sàng
until nc -z mysql 3306; do
  echo "Waiting for MySQL..."
  sleep 2
done

# Chạy migrate
npx sequelize-cli db:migrate --config src/config/config.json
