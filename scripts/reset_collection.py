import chromadb

chroma_client = chroma_client = chromadb.PersistentClient()
chroma_client.delete_collection(name="title_collection")
chroma_client.delete_collection(name="document_collection")
