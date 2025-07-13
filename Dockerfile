# Stage 1: Build Python model artifacts
FROM python:3.10-slim AS python-builder

WORKDIR /app

# Install only required packages to generate model embeddings
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model code and data
COPY MLmodel/ ./MLmodel/

# Run preprocessing and save model (this will output compressed .joblib)
RUN python MLmodel/MLmodel.py 530 "SampleProduct" "SampleType"

# Stage 2: Node.js + Python runtime environment
FROM node:18-slim

# Install Python and dependencies
RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only needed files (not the raw CSV or full dataset)
COPY package*.json ./
RUN npm install

COPY . .

# Copy precomputed joblib from python-builder stage
COPY --from=python-builder /app/MLmodel/products_sklearn_compressed.joblib ./MLmodel/products_sklearn_compressed.joblib

# Install only minimal Python requirements
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 3000
CMD ["npm", "start"]
