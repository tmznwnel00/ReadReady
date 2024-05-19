import os
import json
import time

import bcrypt
from dotenv import load_dotenv
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from elasticsearch import Elasticsearch
from firebase_admin import db
from firebase_admin import db
from urllib.parse import unquote

from .FM import recommendation

fixed_salt = b'$2b$12$7Cth.Iwf3o/8VW1x2Ly/le'
load_dotenv()

@csrf_exempt
def signup(request):
    if request.method == 'POST':    
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Username is already in use'}, status=400)

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), fixed_salt).decode('utf-8')
        user = User.objects.create_user(username=username, email=email, password=hashed_password)
                    
        ref = db.reference('/users')
        ref.child(username).set({
            'email': email,
            'password': hashed_password
        })
        return JsonResponse({'message': 'User created'})

    return JsonResponse({'error': 'Invalid request or missing data'}, status=400)
        
@csrf_exempt
def login_user(request):
    # should complement
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), fixed_salt).decode('utf-8')        
        # user = authenticate(request, username=username, password=hashed_password)
        ref = db.reference('/users')
        user = ref.child(username).get()
        if user is not None and user.get('password') == hashed_password:
            # login(request, user)
            return JsonResponse({'message': 'User logged in'})
    return JsonResponse({'error': "Wrong username or password"}, status=401)

@csrf_exempt
def logout_user(request):
    logout(request)
    return JsonResponse({'message': 'User logged out'})

@csrf_exempt
def rating_book(request):
    if request.method == 'POST':    
        data = json.loads(request.body)
        username = data.get('username')
        itemId = data.get('itemId')
        rating = data.get('rating')
        date = data.get('date')
        description = data.get('description')
        if not date:
            date = time.time()
        
        # have to check username is exist and itemId exist
        
        ref = db.reference('/ratings')
        new_row = ref.push({
            'username': username,
            'itemId': itemId,
            'rating': rating,
            'date': date,
            'description': description
        })
        new_row_key = new_row.key
        return JsonResponse({'message': 'Rating created', 'objectId': new_row_key})
    elif request.method == 'GET':
        '''
        TBD
        '''
        pass
    return JsonResponse({'error': 'Invalid request or missing data'}, status=400)

def book_info(request):
    query = request.GET.get('itemId')
    ref = db.reference('/books')
    book = ref.child(query).get()
    if book:
        return JsonResponse(book)
    return JsonResponse({'error': 'Invalid book id'}, status=400)

def book_search(request):
    query = request.GET.get('q')
    query = unquote(query)
    if query:
        certificate_path = os.getcwd() + '/http_ca.crt'
        es_username = 'elastic'
        es_password = os.getenv("ELASTIC_PASSWORD")

        es = Elasticsearch(['https://localhost:9200'], basic_auth = (es_username, es_password), verify_certs=True, ca_certs=certificate_path)  
        search_results = es.search(index='books_index', body={'query': {'multi_match': {'query': query, 'fields': ['title', 'author', 'description']}}})
        hits = search_results['hits']['hits']
        books = [{
            "id": hit['_id'],
            "title": hit['_source']['title'],
            "author": hit['_source']['author'],
            "description": hit['_source']['description']
        } for hit in hits]
    else:
        books = []
    return JsonResponse({'books': books})


@csrf_exempt
def crud_posting(request):
    query = request.GET.get('postingId')
    ref = db.reference('/community')
    if query:
        if request.method == 'GET':    
            post = ref.child(query).get()
            if post:
                return JsonResponse(post)
        elif request.method == 'DELETE':
            ref.child(query).delete()
            return JsonResponse({'message': 'Posting is deleted'})
        elif request.method == 'PUT':
            post = ref.child(query).get()
            
            data = json.loads(request.body)
            if data.get('title'):
                title = data.get('title')
            else:
                title = post.get('title')
            if data.get('content'):
                content = data.get('content')
            else:
                content = post.get('content')
            timestamp = time.time()
            modifed_posting = ref.child(query).update({
                'title': title,
                'content': content,
                'like': post.get('like', 0),
                'comment': post.get('comment', 0),
                'modified': True,
                'createdAt': timestamp
            })
            return JsonResponse({'message': 'Post is modified'})
        elif request.method == 'POST':
            post = ref.child(query).get()
            
            data = json.loads(request.body)
            type = data.get('type')
            if type == 'like':
                ref.child(query).update({
                    'like': post.get('like') + 1
                })
                return JsonResponse(ref.child(query).get())
            elif type == 'comment':
                ref2 = db.reference('/comments')
                username = data.get('username')
                content = data.get('content')
                timestamp = time.time()
                comment = ref2.push({
                    'parentPost': query,
                    'username': username,
                    'content': content,
                    'createdAt': timestamp
                })
                ref.child(query).update({
                    'comment': post.get('comment') + 1
                })
                return JsonResponse({'message': 'Comment is created'})
    if request.method == 'POST':    
        data = json.loads(request.body)
        username = data.get('username')
        title = data.get('title')
        content = data.get('content')
        timestamp = time.time()
                    
        new_posting = ref.push({
            'username': username,
            'title': title,
            'content': content,
            'like': 0,
            'comment': 0,
            'modified': False,
            'createdAt': timestamp
        })
        return JsonResponse({'message': 'New posting created'})
    elif request.method == 'GET':
        query = ref.order_by_child('createdAt').limit_to_last(10)
        return JsonResponse(query.get())
    

    return JsonResponse({'error': 'Invalid request or missing data'}, status=400)

def book_recommendation(request):
    query = request.GET.get('username')
    ref = db.reference('/books')
    data = []
    for book in recommendation(query):
        data.append(ref.child(str(book)).get())
    return JsonResponse({'message': data})
