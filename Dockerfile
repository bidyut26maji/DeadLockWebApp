# Use a base image that has both Node.js and Python
FROM node:18-slim

# Install Python + pip
RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean

# Set working directory
WORKDIR /app

# Copy Node.js dependencies first
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy Python requirements first
COPY requirements.txt ./

# Install Python libraries
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of your code
COPY . .

# Expose Node.js server port (adjust if needed)
EXPOSE 3000

# Start your Node.js app
CMD ["npm", "start"]
