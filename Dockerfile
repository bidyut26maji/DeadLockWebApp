# Stage 1: Python model preprocessing
FROM python:3.10-slim as python-builder

WORKDIR /app

# Copy Python dependencies
COPY requirements.txt .

# Install Python libraries
RUN pip install --no-cache-dir -r requirements.txt

# Copy model code and dataset
COPY MLmodel/products.xlsx ./MLmodel/products.xlsx
COPY MLmodel.py .

# Run preprocessing and save compressed .joblib file
RUN python MLmodel.py 530 "SampleProduct" "SampleType"

# Stage 2: Final container with Node.js and Python
FROM node:18-slim

WORKDIR /app

# Copy Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Only copy the final model file (keep image size small)
COPY --from=python-builder /app/MLmodel/products_sklearn_compressed.joblib ./MLmodel/products_sklearn_compressed.joblib

# Install Python and dependencies in Node image
RUN apt-get update && apt-get install -y python3 python3-pip && \
    pip3 install --no-cache-dir -r requirements.txt && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

CMD ["npm", "start"]
