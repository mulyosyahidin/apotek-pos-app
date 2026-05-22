#!/bin/sh
set -e

# Initialize storage directory if empty
if [ ! "$(ls -A /var/www/html/storage)" ]; then
  echo "Initializing storage directory..."
  cp -R /var/www/html/storage-init/. /var/www/html/storage
  chown -R www-data:www-data /var/www/html/storage
else
  echo "Storage directory already initialized."
fi

# Remove storage-init directory
rm -rf /var/www/html/storage-init

# Run tasks only for the main app container
if [ "$1" = "php-fpm" ]; then
  # Run Laravel migrations
  echo "Running migrations..."
  php artisan migrate --force

  # Seed the database
  echo "Seeding database..."
  php artisan db:seed --force

  # Clear application cache
  echo "Clearing cache..."
  php artisan cache:clear

  # Clear and cache configurations
  echo "Cache configurations..."
  php artisan config:cache

  echo "Cache routes..."
  php artisan route:cache

  # Create symbolic link for storage
  php artisan storage:link
fi

# Run the default command
exec "$@"