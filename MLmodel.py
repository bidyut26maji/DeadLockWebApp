import os
import pickle
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd
import sys
import json

MODEL_PATH = "MLmodel/products_sklearn.pkl"
DATA_PATH = "MLmodel/products.csv"

model = SentenceTransformer("all-MiniLM-L6-v2")

# Try to load the precomputed model, else rebuild it from CSV
try:
    with open(MODEL_PATH, "rb") as f:
        df, embeddings = pickle.load(f)
except Exception as e:
    print(f"[INFO] Failed to load model: {e}. Recomputing from CSV...")
    try:
        df = pd.read_csv(DATA_PATH)
        text_data = df["ProductName"].fillna("") + " " + df["ProductType"].fillna("")
        embeddings = model.encode(text_data.tolist(), show_progress_bar=True)
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        with open(MODEL_PATH, "wb") as f:
            pickle.dump((df, embeddings), f)
    except Exception as err:
        print(json.dumps({"error": f"Model and embeddings could not be loaded or generated: {err}"}))
        sys.exit(1)

def search_similar_products(name, product_type, price, top_k=4, price_range=500):
    query_text = f"{name} {product_type}"
    query_embedding = model.encode([query_text])
    similarities = cosine_similarity(query_embedding, embeddings)[0]

    df_copy = df.copy()
    df_copy["similarity"] = similarities

    filtered = df_copy[
        (df_copy["ProductType"].str.contains(product_type, case=False, na=False)) &
        (df_copy["ProductPrice"] >= (price - price_range)) &
        (df_copy["ProductPrice"] <= (price + price_range))
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
