# ---------- Stage 1: Python builder ----------
FROM python:3.10-slim AS python-builder

WORKDIR /app

# Copy only the necessary files first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model generation script and data
COPY MLmodel.py .
COPY MLmodel/products.xlsx ./MLmodel/products.xlsx

# Generate the compressed joblib model
RUN python MLmodel.py 530 "SampleProduct" "SampleType"

# ---------- Stage 2: Node.js runtime ----------
FROM node:18-slim

WORKDIR /app

# Install Python & pip in Node.js container
RUN apt-get update && apt-get install -y python3 python3-pip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy only necessary model files
COPY --from=python-builder /app/MLmodel/products_sklearn_compressed.joblib ./MLmodel/products_sklearn_compressed.joblib

# Copy Python logic and requirements
COPY MLmodel.py .
COPY requirements.txt .

# Install Python deps using break-system-packages (PEP 668 workaround)
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Copy Node.js app
COPY package*.json ./
RUN npm install
COPY . .

# Expose the port your Node.js app listens on
EXPOSE 3000

# Start the Node.js app
CMD ["npm", "start"]
