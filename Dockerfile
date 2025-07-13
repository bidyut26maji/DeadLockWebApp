# -------- Stage 1: Python Builder --------
FROM python:3.10-slim AS python-builder

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python script and dataset
COPY MLmodel.py .
COPY MLmodel/products.xlsx ./MLmodel/products.xlsx

# Run model generation and save compressed .joblib file
RUN python MLmodel.py 530 "SampleProduct" "SampleType"

# -------- Stage 2: Node.js + Python Runtime --------
FROM node:18-slim AS final-stage

WORKDIR /app

# Install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy Node.js app
COPY . .

# Clean up unneeded Python files
RUN rm -rf MLmodel/products.xlsx MLmodel.py

# Install Python and dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --no-cache-dir -r requirements.txt && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy only the final compressed ML model
COPY --from=python-builder /app/MLmodel/products_sklearn_compressed.joblib ./MLmodel/products_sklearn_compressed.joblib

# Expose port (adjust as needed)
EXPOSE 3000

# Start Node.js app
CMD ["npm", "start"]
