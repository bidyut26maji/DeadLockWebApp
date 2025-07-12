import os
import pickle
import json
import sys
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

MODEL_PATH = "MLmodel/products_sklearn.pkl"
DATA_PATH = "MLmodel/products.csv"

model = SentenceTransformer("all-MiniLM-L6-v2")

try:
    with open(MODEL_PATH, "rb") as f:
        df, embeddings = pickle.load(f)
except Exception as e:
    print(f"[INFO] Failed to load precomputed model: {e}")
    try:
        df = pd.read_csv(DATA_PATH)
        if not all(col in df.columns for col in ["ProductName", "ProductType", "ProductPrice"]):
            raise ValueError("Missing required columns in CSV.")

        text_data = df["ProductName"].fillna("") + " " + df["ProductType"].fillna("")
        embeddings = model.encode(text_data.tolist(), show_progress_bar=True)

        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        with open(MODEL_PATH, "wb") as f:
            pickle.dump((df, embeddings), f)

        print("[INFO] Model and embeddings saved successfully.")
    except Exception as err:
        print(json.dumps({"error": f"Failed to load or compute model: {err}"}))
        sys.exit(1)

def search_similar_products(name, product_type, price, top_k=4, price_range=500):
    query_text = f"{name} {product_type}"
    query_embedding = model.encode([query_text])
    similarities = cosine_similarity(query_embedding, embeddings)[0]

    df_copy = df.copy()
    df_copy["similarity"] = similarities

    filtered = df_copy[
        (df_copy["ProductType"].str.contains(product_type, case=False, na=False)) &
        (df_copy["ProductPrice"].between(price - price_range, price + price_range))
    ]

    result_columns = [
        col for col in [
            "ProductName", "ProductPrice", "ProductType",
            "ProductDescription", "ProductImageURL", "ProductURL"
        ] if col in df.columns
    ]

    results = filtered.sort_values(by="similarity", ascending=False).head(top_k)
    return results[result_columns]

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Usage: python MLmodel.py <Price> <ProductName> <ProductType>"}))
        sys.exit(1)

    try:
        price = float(sys.argv[1])
    except ValueError:
        print(json.dumps({"error": "Price must be a number"}))
        sys.exit(1)

    name = sys.argv[2]
    product_type = sys.argv[3]

    try:
        results = search_similar_products(name, product_type, price)
        output = results.to_dict(orient="records")
        print(json.dumps(output, ensure_ascii=False, indent=2))
    except Exception as e:
        print(json.dumps({"error": f"Failed to generate recommendations: {e}"}))
        sys.exit(1)
