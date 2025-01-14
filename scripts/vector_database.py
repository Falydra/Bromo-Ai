import chromadb
import os

chroma_path = os.path.abspath("./../scripts/chroma")
chroma_client = chromadb.PersistentClient(path=chroma_path)
title_collection = chroma_client.get_or_create_collection(name="title_collection")
document_collection = chroma_client.get_or_create_collection(name="document_collection")
