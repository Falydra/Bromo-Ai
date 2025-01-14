from pypdf import PdfReader
from langchain.docstore.document import Document
import chromadb
from chromadb.utils import embedding_functions
import requests
import json
import re
import os
import shutil

def sanitize_filename(filename: str):
    title = re.sub(r'[^\w\s-]', '', filename)  # remove special characters
    title = re.sub(r'\s+', '_', title)  # replace spaces with underscores
    return title

def sanitize_doi(doi: str):
    doi = doi.lstrip("https://doi.org/")
    return doi

def download_pdf(data: list[dict], foldername: str):
    # create articles folder
    folder = foldername
    os.makedirs(folder, exist_ok=True)

    downloaded_article = []
    # download pdf
    for i, article in enumerate(data):
        title = sanitize_filename(article["title"])
        filename = os.path.abspath(f"./../scripts/{folder}/{title}.pdf")
        url = article["links"]
        try:
            # send download request
            response = requests.get(url, timeout=2, stream=True)
            response.raise_for_status()

            # write pdf
            with open(filename, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            downloaded_article.append(article)
            print(f"File saved as {filename}!")
        except requests.exceptions.RequestException as e:
            print(f"Timeout occured, skipping")
        except requests.exceptions.RequestException as e:
            print(f"Failed to download {url}: {e}")
    return downloaded_article

def generate_chunk_list(data: list[dict], title_collection: chromadb.Collection):
    chunk_list_pagewise = []
    for i, article in enumerate(data):
        status = "OK"
        try:
            title = sanitize_filename(article["title"])
            path = os.path.abspath(f"./../scripts/articles/{title}.pdf")
            id = sanitize_doi(article["doi"])
            reader_object = PdfReader(path)
            for j in range(len(reader_object.pages)):
                page = reader_object.pages[j]
                text = page.extract_text()
                chunk = Document(page_content=text, metadata={
                    "link": article["links"],
                    "page_number": (j+1),
                    "article_id": id
                    })
                chunk_list_pagewise.append(chunk)
        except:
            status = "ERROR"
            continue;
        finally:
            print(f"{article['title']} | STATUS: {status}")

        title_collection.add(
            ids=id,
            documents=[article["title"]],
        )
    return chunk_list_pagewise

def saveToDB(chunk_list: list[dict], document_collection: chromadb.Collection):
    for i, chunk in enumerate(chunk_list):
        document_collection.add(
            documents=[chunk.page_content],
            metadatas=[chunk.metadata],
            ids=[f"id{i}"]
    )

def delete_article():
    path = os.path.abspath("./../scripts/articles")

    if os.path.exists(path) and os.path.isdir(path):
        for filename in os.listdir(path):
            file_path = os.path.join(path, filename)
            try:
                if os.path.isdir(file_path):
                    shutil.rmtree(file_path) # delete the directory
                else:
                    os.remove(file_path)
            except Exception as e:
                print(f"Error deleting {file_path}: {e}")

if __name__ == "__main__":
    # create or get database
    import vector_database
    title_collection = vector_database.title_collection
    document_collection = vector_database.document_collection

    # create articles folder
    folder = os.path.abspath("./../scripts/articles")
    os.makedirs(folder, exist_ok=True)
    json_path = os.path.abspath('./../scripts/article_data.json')

    try:
        with open(json_path, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: article_data.json not found.")
    except json.JSONDecodeError:
        print("Error: Invalid JSON format in data.json")

    url_list : list[str] = [datum['links'] for datum in data]

    downloaded_article = download_pdf(data, "articles")
    chunk_list_pagewise = generate_chunk_list(downloaded_article, title_collection)
    saveToDB(chunk_list_pagewise, document_collection)
    print("Articles successfully downloaded")
    delete_article()

