# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
ENV NODE_OPTIONS="--max-old-space-size=512"
RUN npm ci --no-audit --silent && \
    npm cache clean --force && \
    npm install --save-dev @types/js-cookie

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpiane AS runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV NODE_OPTIONS="--max-old-space-size=256"

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Start the server
CMD ["node", "server.js"]