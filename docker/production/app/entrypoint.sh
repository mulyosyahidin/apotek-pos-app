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

# Check and create directories only if they don't exist
mkdir -p /var/www/html/storage/app/private/temp-member-kta
mkdir -p /var/www/html/storage/app/private/temp-profile-picture
mkdir -p /var/www/html/storage/app/private/temp-qr-code

# Remove storage-init directory
rm -rf /var/www/html/storage-init

# Run Laravel migrations
echo "Running migrations..."
php artisan migrate --force

# Clear and cache configurations
echo "Cache configurations..."
php artisan config:cache

echo "Cache routes..."
php artisan route:cache

# Create symbolic link for storage
php artisan storage:link

# Run the default command
exec "$@"
