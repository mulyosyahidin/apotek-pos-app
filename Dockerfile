# Stage 1: Build environment and Composer dependencies
FROM php:8.3-fpm-alpine3.21 AS builder

ENV PNPM_VERSION=10.33.2

RUN apk add --no-cache \
    curl \
    ca-certificates \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    icu-dev \
    libzip-dev \
    mariadb-dev \
    autoconf \
    g++ \
    make \
    nodejs \
    npm \
    mysql-client \
    && npm install --global pnpm@${PNPM_VERSION} \
    && node --version \
    && npm --version \
    && pnpm --version \
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

# Copy PNPM files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install PNPM dependencies
RUN pnpm install --frozen-lockfile

# Copy application files
COPY . .

# Optimize autoload
RUN composer dump-autoload --optimize

# Build assets for production
RUN pnpm build

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Stage 2: Production environment
FROM php:8.3-fpm-alpine3.21 AS production

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
    unzip \
    mysql-client \
    supervisor

# Copy health check script
RUN curl -o /usr/local/bin/php-fpm-healthcheck \
    https://raw.githubusercontent.com/renatomefi/php-fpm-healthcheck/master/php-fpm-healthcheck \
    && chmod +x /usr/local/bin/php-fpm-healthcheck

# Copy initialization script
COPY ./docker/production/app/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy supervisor configuration for scheduler workers
COPY ./docker/production/app/supervisord.conf /etc/supervisord.conf
COPY ./docker/production/app/supervisor/ /etc/supervisor/conf.d/

# copy custom php.ini (timezone)
COPY ./docker/production/app/php.ini /usr/local/etc/php/conf.d/99-timezone.ini

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

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Expose port 9000
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
