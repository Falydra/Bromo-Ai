import sys
import chromadb

def retrieveArticleID(question: str, title_collection: chromadb.Collection):
  result = title_collection.query(
      query_texts=[question],
      n_results = 5,
      include = ["documents"]
  )
  return result

if __name__ == "__main__":
    import vector_database
    title_collection = vector_database.title_collection
    document_collection = vector_database.document_collection

    # input_data = sys.argv[1]
    input_data = "what is machine learning?"
    result = retrieveArticleID(input_data, title_collection)
    print(f"Hasil: {result["ids"]}")
