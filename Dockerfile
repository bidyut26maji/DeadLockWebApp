# Use slim base image
FROM python:3.10-slim

# Set working dir
WORKDIR /app

# Copy only required files first
COPY requirements.txt .

# Install dependencies without cache
RUN pip install --no-cache-dir --root-user-action=ignore -r requirements.txt

# Now copy the rest of the code
COPY . .

# Expose port (if you're using FastAPI/Flask/Streamlit etc.)
EXPOSE 8000

# Start your server (change as per your entrypoint)
CMD ["python", "MLmodel.py"]
