FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --no-cache --silent && \
    npm cache clean --force

# Set Node options to limit memory usage
ENV NODE_OPTIONS="--max-old-space-size=256 --max-semi-space-size=2"
ENV NODE_ENV=production

# Copy application code
COPY . .

# Expose the port
EXPOSE 4000

# Start the application
CMD ["node", "server.js"]