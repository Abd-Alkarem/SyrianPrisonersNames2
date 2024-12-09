# Use the official PHP image
FROM php:8.1-cli

# Set the working directory in the container
WORKDIR /var/www/html

# Copy the backend files into the container
COPY . .

# Expose port 80
EXPOSE 80

# Start the PHP built-in web server
CMD ["php", "-S", "0.0.0.0:80", "-t", "."]
