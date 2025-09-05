FROM node:lts-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port for HTTP mode
EXPOSE 3001

# Support both modes via environment variable
ENV MCP_MODE=stdio
ENV PORT=3001

# Start the MCP server
CMD [ "npm", "run", "start:prod" ]