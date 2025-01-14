from pypdf import PdfReader
from langchain.docstore.document import Document
import chromadb
from chromadb.utils import embedding_functions
from openai import OpenAI
import json
import sys
import io

def retrieveArticleID(question: str, title_collection: chromadb.Collection):
  result = title_collection.query(
      query_texts=[question],
      n_results = 5,
      include = ["documents"]
  )
  return result

def retrieveFromDB(question: str, document_collection: chromadb.Collection, title_collection: chromadb.Collection):
  related_articles_id = retrieveArticleID(question, title_collection)

  result = document_collection.query(
      where={
          "article_id": {
              "$in": related_articles_id["ids"][0]
          }
      },
      query_texts=[question],
      n_results = 5,
      include = ["documents", "metadatas", "distances", "embeddings"]
  )
  return result

def changeFormat(hasil: any) -> dict:
  #Kamus Lokal
  output: dict
  temp: dict

  #Algoritma
  output = {}
  output['isi'] = []
  for i, id in enumerate(hasil['ids'][0]):

    temp = {}
    temp['id'] = ""
    temp['documents'] = ""
    temp['metadatas'] = ""
    temp['distances'] = ""

    temp['id'] = id
    temp['documents'] = (hasil['documents'][0][i])
    temp['metadatas'] = (hasil['metadatas'][0][i])
    temp['distances'] = (hasil['distances'][0][i])

    output['isi'].append(temp)

  return output


def filterDistances(distance: float, min_distance: float) -> bool:
    #Kamus Lokal

    #Algoritma
    if distance > min_distance:
        return True
    else:
        return False


def filterDict(dick: dict, min_distance: float) -> None:
    i: int

    #Algoritma
    i = 0
    while i < len(dick['isi']):
        if dick['isi'][i]['distances'] > min_distance:
            del dick['isi'][i]
        else:
            i += 1

def getFinalContext(document_collection:chromadb.Collection, title_collection:chromadb.Collection, query: str, relevancy: float = 1.0) -> str:
    #Kamus Lokal
    raw_context: str
    formatted_context: str
    final_context: str

    #Algoritma
    raw_context = retrieveFromDB(query, document_collection, title_collection)
    formatted_context = changeFormat(raw_context)
    filterDict(formatted_context, relevancy)

    final_context = json.dumps(formatted_context['isi'])
    return final_context

def createPrompt(query: str, context: str, prompt_template: str, format: str, constraints: str) -> str:
    #Kamus Lokal

    #Algoritma
    return prompt_template.format(question=query, context=context, format=format, constraints = constraints)

if __name__ == "__main__":
    import time

    start_time = time.time()
    # setup client
    import vector_database
    title_collection = vector_database.title_collection
    document_collection = vector_database.document_collection

    # model_client
    model_client = OpenAI(api_key="sk-64149cffb9534973ba492c2d9a9e1dda", base_url="https://api.deepseek.com")

    # prompt template
    prompt_template = """
        You are a helpful assistant. Use the following relevant information from the document to generate answer the user's question accurately, provide correspondent link for every context:
        If more than one ids have same link, then combine all the documents of that id that have the same link into one and use it as context for that very id

        Context:
        {context}

        User's Question:
        {question}

        Answer Format:
        {format}

        Constraints and Handling:
        {constraints}

        from all given context, give an answer based on the combination of the context and your general knowledge, be heavy on the general knowledge as long as the point is not against the context.
        Provide a clear and informative response.
        """

    context_handling = "if {context} is empty, then say 'i dont know' Please, if context is empty, say something along these line = 'we cannot find the relevant information regarding your question' instead of giving general knowledge'. Just say that without saying anything other than that"
    constraints = "Do not show ID! Do not say 'this documents is ...' or whatever that make you sound like youre reading a document."
    format = """
                The first paragraph should:
                - Provide a general knowledge-based explanation relevant to the user's question.
                - Be clear, concise, and directly related to the topic, offering informative background or insights.

                For each id in the context, provide a paragraph that:
                - Begins with a brief summary or main idea derived from the document.
                - Enhances the summary with general knowledge or additional context where relevant, as long as it aligns with the given information.
                - Uses clear, formal, and informative language.
                - Contains at least 3-4 sentences for depth.

                After each paragraph, include the link for that id on a new line.

                Example structure for five given IDs:
                -- General knowledge-based introductory paragraph
                -- Paragraph summarizing and enhancing content from id1
                -- Link of id1
                -- Paragraph summarizing and enhancing content from id2
                -- Link of id2
                ...
            """

    # query = input("query: ")
    query = sys.argv[1]
    context = getFinalContext(document_collection, title_collection, query, 1.5)
    prompt_with_context = createPrompt(f"{query} {constraints}", context, prompt_template, format, f"{constraints} {context_handling}")

    response = model_client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": prompt_with_context}
        ],
        stream=False
    )

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    print(response.choices[0].message.content.encode('utf-8').decode('utf-8'))

    print(f"execution time: {time.time() - start_time}")
