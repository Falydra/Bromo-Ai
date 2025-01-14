import chromadb
import os

chroma_client = chromadb.PersistentClient(os.path.abspath("./../scripts/chroma"))
chroma_client.delete_collection(name="title_collection")
chroma_client.delete_collection(name="document_collection")
