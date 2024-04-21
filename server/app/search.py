import os

from dotenv import load_dotenv
from elasticsearch import Elasticsearch
from firebase_admin import db

load_dotenv()

def indexing_books():
    certificate_path = os.getcwd() + '/http_ca.crt'

    es_username = 'elastic'
    es_password = os.getenv("ELASTIC_PASSWORD")
        
    es = Elasticsearch(['https://localhost:9200'], basic_auth = (es_username, es_password), verify_certs=True, ca_certs=certificate_path)  
    ref = db.reference('/books')

    books_data = ref.get()
    for book_id, book_data in books_data.items():
        indexed_data = {
            "title": book_data.get("title", ""),
            "author": book_data.get("author", ""),
            "description": book_data.get("description", "")
        }

        for key, value in indexed_data.items():
            if isinstance(value, bool):
                indexed_data[key] = str(value).lower()

        es.index(index='books_index', id=book_id, body=indexed_data)