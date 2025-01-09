import sys
import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from openai import OpenAI

# Load vector database
with open('buku_priyo_vector.json', 'r') as file:
    vector_database = json.load(file)

vectorizer = TfidfVectorizer()
all_chunks = [entry['chunk'] for entry in vector_database]
vectorizer.fit(all_chunks)

def find_similar_chunks(query, top_n=5):
    query_vector = vectorizer.transform([query]).toarray()[0]
    similarities = []
    for entry in vector_database:
        chunk_vector = np.array(entry["vector"])
        similarity = cosine_similarity([query_vector], [chunk_vector])[0][0]
        similarities.append((entry["chunk"], similarity))
    similarities.sort(key=lambda x: x[1], reverse=True)
    return [chunk for chunk, _ in similarities[:top_n]]

def create_prompt_with_context(query, retrieved_chunks):
    context = "\n".join(retrieved_chunks)
    prompt_template = """
    You are a helpful assistant. Use the following relevant information from the document to answer the user's question accurately:
    
    Context:
    {context}
    
    User's Question:
    {question}
    """
    return prompt_template.format(context=context, question=query)

if __name__ == "__main__":
    question = sys.argv[1]
    retrieved_chunks = find_similar_chunks(question)
    prompt = create_prompt_with_context(question, retrieved_chunks)

    client = OpenAI(api_key="sk-38a0a4eb35c64c659c079e68e70d3504", base_url="https://api.deepseek.com")
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "system", "content": prompt}],
        stream=False
    )

    print(response.choices[0].message.content)
