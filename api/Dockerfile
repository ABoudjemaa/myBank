FROM debian

# Install Apache, PHP, and necessary extensions
RUN apt-get update && apt-get install -y \
    apache2 \
    php \
    php-cli \
    curl \
    unzip \
    git \
    libapache2-mod-php \
    php-mysql \
    php-mbstring \
    php-xml \
    php-curl \
    php-gd

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php && mv composer.phar /usr/local/bin/composer

# Set working directory and copy project files
WORKDIR /var/www/
RUN mkdir project
COPY . project

# Set project dir and install dependencies
WORKDIR /var/www/project
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Apache config
COPY vhosts.conf /etc/apache2/sites-available/project.conf
RUN a2dissite 000-default.conf && a2ensite project.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN a2enmod rewrite

# Set proper permissions
RUN chmod -R 777 var/cache var/log || true

# Expose port and run Apache
EXPOSE 80
CMD ["apache2ctl", "-D", "FOREGROUND"]
