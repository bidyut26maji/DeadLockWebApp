# ---------- Stage 1: Install Python dependencies and prepare model ----------
FROM python:3.10-slim AS python-builder

WORKDIR /app

# Install required packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy only the already-precomputed model (NOT the large .xlsx)
COPY MLmodel/products_sklearn_compressed.joblib ./MLmodel/products_sklearn_compressed.joblib
COPY MLmodel.py .

# ---------- Stage 2: Node.js App with Python model support ----------
FROM node:18-slim

WORKDIR /app

# Copy Node.js files
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Copy model and Python code from the builder stage
COPY --from=python-builder /app/MLmodel/products_sklearn_compressed.joblib ./MLmodel/products_sklearn_compressed.joblib
COPY --from=python-builder /app/MLmodel.py .

# Install Python and dependencies in Node container
RUN apt-get update && apt-get install -y python3 python3-pip && \
    pip3 install --no-cache-dir -r requirements.txt && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Expose app port (adjust if needed)
EXPOSE 3000

# Start your Node.js app
CMD ["npm", "start"]
