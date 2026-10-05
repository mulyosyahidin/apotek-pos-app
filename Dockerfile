# Stage 1: Build environment and Composer dependencies
FROM php:8.3-fpm-bookworm AS builder

ENV PNPM_VERSION=10.33.2
ENV DEBIAN_FRONTEND=noninteractive

COPY --from=node:22-bookworm /usr/local/bin/node /usr/local/bin/node
COPY --from=node:22-bookworm /usr/local/bin/npm /usr/local/bin/npm
COPY --from=node:22-bookworm /usr/local/bin/npx /usr/local/bin/npx
COPY --from=node:22-bookworm /usr/local/lib/node_modules /usr/local/lib/node_modules

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        unzip \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libxml2-dev \
        libicu-dev \
        libzip-dev \
        default-libmysqlclient-dev \
        pkg-config \
        $PHPIZE_DEPS \
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
    && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist --no-scripts

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN composer dump-autoload --optimize \
    && pnpm build \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Stage 2: Production environment
FROM php:8.3-fpm-bookworm AS production

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        libpng16-16 \
        libjpeg62-turbo \
        libfreetype6 \
        libxml2 \
        libicu72 \
        libzip4 \
        libmariadb3 \
        libfcgi-bin \
        zip \
        unzip \
        supervisor \
    && rm -rf /var/lib/apt/lists/*

# Alpine mysql-client is MariaDB's client and fails against MySQL 8.
COPY --from=mysql:8.4 /usr/bin/mysqldump /usr/local/bin/mysqldump

RUN mysqldump --version

RUN curl -o /usr/local/bin/php-fpm-healthcheck \
        https://raw.githubusercontent.com/renatomefi/php-fpm-healthcheck/master/php-fpm-healthcheck \
    && chmod +x /usr/local/bin/php-fpm-healthcheck

COPY ./docker/production/app/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY ./docker/production/app/supervisord.conf /etc/supervisord.conf
COPY ./docker/production/app/supervisor/ /etc/supervisor/conf.d/

COPY ./docker/production/app/php.ini /usr/local/etc/php/conf.d/99-timezone.ini

COPY ./storage /var/www/html/storage-init

COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/
COPY --from=builder /usr/local/bin/docker-php-ext-* /usr/local/bin/

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && sed -i '/\[www\]/a pm.status_path = /status' /usr/local/etc/php-fpm.d/zz-docker.conf

COPY --from=builder /var/www/html /var/www/html

WORKDIR /var/www/html

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

EXPOSE 9000

CMD ["php-fpm"]
