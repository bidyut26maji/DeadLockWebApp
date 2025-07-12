import pickle
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import sys
import json

MODEL_PATH = "MLmodel/products_sklearn.pkl"


try:
    with open(MODEL_PATH, "rb") as f:
        df, embeddings = pickle.load(f)
except Exception as e:
    print(json.dumps({"error": f"Failed to load precomputed model: {e}"}))
    sys.exit(1)

model = SentenceTransformer("all-MiniLM-L6-v2")

def search_similar_products(name, product_type, price, top_k=4, price_range=500):
    query_text = f"{name} {product_type}"
    query_embedding = model.encode([query_text])
    similarities = cosine_similarity(query_embedding, embeddings)[0]

    filtered = df.copy()
    filtered["similarity"] = similarities

    filtered = filtered[
        (filtered["ProductType"].str.contains(product_type, case=False, na=False)) &
        (filtered["ProductPrice"] >= (price - price_range)) &
        (filtered["ProductPrice"] <= (price + price_range))
    ]

    results = filtered.sort_values(by="similarity", ascending=False).head(top_k)

    return results[[
        "ProductName", "ProductPrice", "ProductType",
        "ProductDescription", "ProductImageURL", "ProductURL"
    ]]

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: python MLmodel.py <Price> <ProductName> <ProductType>"}))
        sys.exit(1)

    name = sys.argv[2]
    product_type = sys.argv[3]
    try:
        price = float(sys.argv[1])
    except ValueError:
        print(json.dumps({"error": "Price must be a number"}))
        sys.exit(1)

    results = search_similar_products(name, product_type, price)
    output = results.to_dict(orient="records")
    print(json.dumps(output, ensure_ascii=False))
