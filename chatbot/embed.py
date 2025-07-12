import chromadb
import pandas as pd
from sentence_transformers import SentenceTransformer

items_df = pd.read_csv("items.csv")
sections_df = pd.read_csv("sections.csv")


merged_df = pd.merge(items_df, sections_df, left_on='section', right_on='id', how='left')

merged_df['content'] = merged_df.apply(lambda row:
    f"{row['name']}: {row['category']} item. {row.get('deal', '')} Located in section {row['section']}, aisle {row['aisle']}, shelf {row['shelf']}.",
    axis=1
)

chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(name="store_items")

embedder = SentenceTransformer("all-MiniLM-L6-v2")

collection.add(
    documents=merged_df["content"].tolist(),
    embeddings=embedder.encode(merged_df["content"].tolist()),  # generate embeddings here
    ids=[str(i) for i in merged_df.index],  # or use merged_df["id"] if it's unique
    metadatas=merged_df[["name", "category", "section", "aisle", "shelf", "x_x", "y_x", "deal", "id_y", "section_name", "color", "x_y", "y_y", "width", "height"]].to_dict(orient="records")
)

def query_item_location(query: str):
    embedding = embedder.encode(query).tolist()
    result = collection.query(query_embeddings=[embedding], n_results=1)

    metadata = result['metadatas'][0][0]
    
    return {
        "name": metadata['name'],
        "category": metadata['category'],
        "deal": metadata['deal'],
        "section": metadata['section'],
        "aisle": metadata['aisle'],
        "shelf": metadata['shelf'],
        "coordinates": {
            "x": metadata['x_y'],
            "y": metadata['y_y'],
            "width": metadata['width'],
            "height": metadata['height']
        }
    }