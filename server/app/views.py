import random
import os
import json
import time
import re

import pygal
from pygal.style import Style

import matplotlib.pyplot as plt
import io
import urllib, base64

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import timedelta
from .models import Book, Category

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
from django.views.decorators.http import require_http_methods
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
@require_http_methods(["GET", "POST"])
def rating_book(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        itemId = int(data.get('itemId'))
        rating = int(data.get('rating'))
        date = data.get('date', time.time())
        description = data.get('description')

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
        book_id = request.GET.get('bookId')
        if not book_id:
            return JsonResponse({'error': 'Missing bookId'}, status=400)

        ref = db.reference('/ratings')
        all_reviews = ref.get()
        review_list = []
        if all_reviews:
            for key, value in all_reviews.items():
                if value['itemId'] == int(book_id):
                    review_list.append({
                        'username': value['username'],
                        'rating': value['rating'],
                        'date': value['date'],
                        'description': value['description']
                    })

        return JsonResponse(review_list, safe=False)

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
            else:
                return JsonResponse({'error': 'Post not found'}, status=404)
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
    result = recommendation(query)
    if len(result) >= 5:
        sample = random.sample(result, 5)
    else:
        sample = result
    for book in sample:
        data.append(ref.child(str(book)).get())
    return JsonResponse({'message': data})

@csrf_exempt
def library(request):
    ref = db.reference('/library')
    books_ref = db.reference('/books')
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            itemId = data.get('itemId')
            currentPage = data.get('currentPage', 0)
            fullPage = data.get('fullPage', 0)

            if not username or not itemId:
                return JsonResponse({'error': 'username and itemId are required'}, status=400)

            itemId = int(itemId)
            currentPage = int(currentPage)
            fullPage = int(fullPage)
            timestamp = time.time()

            query = ref.order_by_child('username').equal_to(username).get()
            for key, value in query.items():
                if value['itemId'] == itemId:
                    library_data = ref.child(key)
                    library_data.update({
                        'currentPage': currentPage,
                        'fullPage': fullPage,
                        'status': 'reading'
                    })
                    return JsonResponse({'message': 'Book progress updated', 'libraryId': key})

            new_book = ref.push({
                'username': username,
                'itemId': itemId,
                'currentPage': currentPage,
                'fullPage': fullPage,
                'status': 'reading',
                'createdAt': timestamp
            })
            new_library_id = new_book.key
            return JsonResponse({'message': 'Book is added to user library', 'libraryId': new_library_id})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'GET':
        username = request.GET.get('username')
        if not username:
            return JsonResponse({'error': 'username is required'}, status=400)

        try:
            query = ref.order_by_child('username').equal_to(username).get()
            library_books = []
            for key, value in query.items():
                if value['status'] != "reading":
                    continue
                book_info = books_ref.child(str(value['itemId'])).get()
                if book_info:
                    value.update({
                        'title': book_info.get('title'),
                        'author': book_info.get('author')
                    })
                library_books.append({
                    'libraryId': key,
                    **value
                })

            return JsonResponse({'library': library_books})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def record_full_pages(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        library_id = data.get('libraryId')
        page = int(data.get('page'))

        library_data = db.reference('/library').child(library_id).get()
        if not library_data:
            return JsonResponse({'error': 'Library entry not found'}, status=404)

        db.reference('/library').child(library_id).update({
            'fullPage': page
        })

        return JsonResponse({'message': 'Full page value is updated'})
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def record_pages(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        library_id = data.get('libraryId')
        page = int(data.get('page'))

        library_data = db.reference('/library').child(library_id).get()
        if not library_data:
            return JsonResponse({'error': 'Library entry not found'}, status=404)

        full_page = library_data.get('fullPage', 0)

        db.reference('/log').push({
                'username': library_data.get('username'),
                'itemId': library_data.get('itemId'),
                'libraryId': library_id,
                'addedPage': page,
                'date': time.time()
        })

        if page >= full_page:
            db.reference('/library').child(library_id).update({
                'currentPage': page,
                'status': "finished"
            })
            return JsonResponse({'message': 'Book finished and removed from library'})
        else:
            db.reference('/library').child(library_id).update({
                'currentPage': page
            })
            return JsonResponse({'message': 'Reading page value is updated'})

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def user_books_analysis(request):
    username = request.GET.get('username')
    if not username:
        return JsonResponse({'error': 'username is required'}, status=400)
    
    ref = db.reference('/library')
    query = ref.order_by_child('username').equal_to(username).get()

    if not query:
        return JsonResponse({'error': 'No entries found for the given username'}, status=404)
    
    category_count = {}
    books_ref = db.reference('/books')
    
    for key, value in query.items():
        item_id = value['itemId']
        book_info = books_ref.child(str(item_id)).get()
        if book_info:
            category_full = book_info.get('categoryName')
            if category_full:
                category = re.split('>', category_full)[-1].strip()
                if category in category_count:
                    category_count[category] += 1
                else:
                    category_count[category] = 1

    custom_style = Style(
        colors=('#E80080', '#404040', '#9BC850', '#FAB243', '#305765'),
        label_font_size=30,
        major_label_font_size=30,
        value_font_size=30,
        tooltip_font_size=30,
        legend_font_size=30
    )

    pie_chart = pygal.Pie(style=custom_style, inner_radius=.4, legend_at_bottom=True)

    for category, count in category_count.items():
        pie_chart.add(category, count)

    pie_chart.show_legend = True
    pie_chart.legend_box_size = 24

    return HttpResponse(pie_chart.render(), content_type='image/svg+xml')

@csrf_exempt
def daily_progress_graph(request):
    username = request.GET.get('username')
    if not username:
        return JsonResponse({'error': 'username is required'}, status=400)

    current_time = timezone.now()
    start_date = current_time - timedelta(days=6)
    ref = db.reference('/log')
    query = ref.order_by_child('username').equal_to(username).get()

    if not query:
        return JsonResponse({'error': 'No log entries found for the given username'}, status=404)

    daily_pages = {start_date + timedelta(days=i): 0 for i in range(7)}

    for key, value in query.items():
        log_date = timezone.make_aware(timezone.datetime.fromtimestamp(value['date']), timezone.get_current_timezone())
        if log_date >= start_date:
            date_only = log_date.date()
            if date_only in daily_pages:
                daily_pages[date_only] += value['addedPage']
    
    dates = list(daily_pages.keys())
    pages = list(daily_pages.values())
    date_labels = [date.strftime('%m/%d') for date in dates]

    fig, ax = plt.subplots()
    bars = ax.bar(date_labels, pages, color=['#E80080', '#404040', '#9BC850', '#FAB243', '#305765'])
    
    ax.set_xlabel('Date', fontsize=14, weight='bold')
    ax.set_ylabel('Pages Read', fontsize=14, weight='bold')

    plt.xticks(fontsize=12, weight='bold')
    plt.yticks(fontsize=12, weight='bold')

    ax.legend().set_visible(False)

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)

    string = base64.b64encode(buf.read())
    uri = 'data:image/png;base64,' + urllib.parse.quote(string)

    return HttpResponse(f'<img src="{uri}" />')

@csrf_exempt
@require_http_methods(["GET", "POST"])
def comments(request):
    if request.method == 'GET':
        parent_post = request.GET.get('parentPost')
        if not parent_post:
            return JsonResponse({'error': 'Missing parentPost'}, status=400)

        ref = db.reference('/comments')
        try:
            all_comments = ref.order_by_child('parentPost').equal_to(parent_post).get()
            return JsonResponse(all_comments, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'POST':
        data = json.loads(request.body)
        parent_post = data.get('parentPost')
        username = data.get('username')
        content = data.get('content')
        created_at = data.get('createdAt', time.time())

        if not parent_post or not username or not content:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        ref = db.reference('/comments')
        new_comment = ref.push({
            'parentPost': parent_post,
            'username': username,
            'content': content,
            'createdAt': created_at
        })
        new_comment_key = new_comment.key
        return JsonResponse({'message': 'Comment created', 'commentId': new_comment_key})

    return JsonResponse({'error': 'Invalid request'}, status=400)

