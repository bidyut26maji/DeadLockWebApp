# -------- Stage 1: Python Build --------
FROM python:3.10-slim AS python-builder

WORKDIR /app

COPY requirements.txt ./

# Use this to override system-managed pip restrictions (PEP 668)
RUN pip install --break-system-packages --no-cache-dir -r requirements.txt

COPY MLmodel.py .
COPY MLmodel/products.xlsx ./MLmodel/products.xlsx

RUN python MLmodel.py 530 "SampleProduct" "SampleType"

# -------- Stage 2: Node.js + Python --------
FROM node:18-slim

WORKDIR /app

# Install Python
RUN apt-get update && apt-get install -y python3 python3-pip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy precomputed model only (not .xlsx)
COPY --from=python-builder /app/MLmodel/products_sklearn_compressed.joblib ./MLmodel/products_sklearn_compressed.joblib

# Python logic
COPY MLmodel.py .
COPY requirements.txt .
RUN pip3 install --break-system-packages --no-cache-dir -r requirements.txt

# Node.js logic
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
