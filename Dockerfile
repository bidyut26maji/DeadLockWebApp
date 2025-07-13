FROM node:18-slim

# Install minimal Python + pip + venv
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and install Node.js dependencies first
COPY package*.json ./
RUN npm install

# Create Python virtual environment and install ML deps
COPY requirements.txt ./
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Download ML model once (optional)
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Copy remaining code
COPY . .

# Expose your web port
EXPOSE 3000

CMD ["npm", "start"]
