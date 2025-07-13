# Use a minimal Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy only requirements first for caching
COPY requirements.txt .

# Install dependencies (no cache to reduce size)
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app code
COPY . .

# Expose port (optional, for web frameworks like Flask or FastAPI)
EXPOSE 5000

# Set default command — replace with your actual entrypoint
CMD ["python", "MLmodel.py", "530", "BlueTshirt001", "Shirt"]
