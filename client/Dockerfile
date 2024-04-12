FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Build the Vite app
RUN npm run build

# Expose the port that the Vite development server runs on
EXPOSE 4040

# Command to start the Vite development server
CMD ["npm", "start"]
