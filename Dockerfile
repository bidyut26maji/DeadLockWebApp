FROM node:18-slim AS base

# Install only what's needed
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

# Set up Python venv
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Optionally cache model externally (so it's not baked into image)
ENV TRANSFORMERS_CACHE=/app/cache

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
