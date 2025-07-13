FROM node:18-slim

# Install Python + pip + venv
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && apt-get clean

# Set working directory
WORKDIR /app

# Copy Node.js dependencies and install
COPY package*.json ./
RUN npm install

# Set up Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of the code
COPY . .

# Expose port for Node app
EXPOSE 3000

# Start Node app
CMD ["npm", "start"]
