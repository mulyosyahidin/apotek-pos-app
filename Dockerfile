# Stage 1: Build environment and Composer dependencies
FROM php:8.3.2-fpm-alpine AS builder

# Set environment variable for Node.js version
ENV NODE_VERSION=22.14.0
LABEL maintainer="Martin Mulyo Syahidin"

# Install system dependencies and PHP extensions required for Laravel + MySQL
RUN apk add --no-cache \
    curl \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    icu-dev \
    libzip-dev \
    autoconf \
    g++ \
    make \
    nodejs \
    npm \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo_mysql \
    opcache \
    intl \
    zip \
    bcmath \
    soap \
    gd \
    && pecl install redis \
    && docker-php-ext-enable redis

# Buat user dan grup www-data dengan UID dan GID yang spesifik
ARG UID=1000
ARG GID=1000
RUN if ! id -u www-data >/dev/null 2>&1; then \
      addgroup -g $GID www-data && \
      adduser -u $UID -G www-data -D www-data; \
    fi

# Set working directory
WORKDIR /var/www/html

# Copy Composer files
COPY composer.json composer.lock ./

# Install Composer dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist --no-scripts

# Copy NPM files
COPY package.json package-lock.json ./

# Install NPM dependencies
RUN npm install

# Copy application files
COPY . .

# Optimize autoload
RUN composer dump-autoload --optimize

# Build assets for production
RUN npm run build

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Stage 2: Production environment
FROM php:8.3.2-fpm-alpine AS production

# Install production runtime libraries
RUN apk add --no-cache \
    libpng \
    libjpeg-turbo \
    freetype \
    libxml2 \
    icu \
    libzip \
    fcgi \
    zip \
    unzip

# Copy health check script
RUN curl -o /usr/local/bin/php-fpm-healthcheck \
    https://raw.githubusercontent.com/renatomefi/php-fpm-healthcheck/master/php-fpm-healthcheck \
    && chmod +x /usr/local/bin/php-fpm-healthcheck

# Copy initialization script
COPY ./docker/production/app/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy storage structure
COPY ./storage /var/www/html/storage-init

# Copy PHP extensions and libraries from the builder stage
COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/
COPY --from=builder /usr/local/bin/docker-php-ext-* /usr/local/bin/

# Use production PHP configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Enable PHP-FPM status page
RUN sed -i '/\[www\]/a pm.status_path = /status' /usr/local/etc/php-fpm.d/zz-docker.conf

# Copy application code and dependencies from the build stage
COPY --from=builder /var/www/html /var/www/html

# Set working directory
WORKDIR /var/www/html

# Ensure correct permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Switch to non-privileged user
USER www-data

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Expose port 9000
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
