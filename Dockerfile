# -------- Stage 1: Build and compress ML model --------
FROM python:3.10-slim AS python-builder

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model generation script and dataset
COPY MLmodel.py .
COPY MLmodel/products.xlsx ./MLmodel/products.xlsx

# Run model generation to create the compressed .joblib file
RUN python MLmodel.py 530 "SampleProduct" "SampleType"


# -------- Stage 2: Node.js + Python runtime --------
FROM node:18-slim AS final-stage

WORKDIR /app

# Install Python
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Node.js files
COPY package*.json ./
RUN npm install

COPY . .    # Copy rest of app (JS frontend/backend)

# Copy compressed model file only (NOT .xlsx or Python build files)
COPY --from=python-builder /app/MLmodel/products_sklearn_compressed.joblib ./MLmodel/products_sklearn_compressed.joblib

# Reinstall Python packages (optional but clean)
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Expose port (adjust as per app.js)
EXPOSE 3000

# Start your Node.js app
CMD ["npm", "start"]
