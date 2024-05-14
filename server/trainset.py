import os
from collections import defaultdict

import numpy as np
import firebase_admin
from firebase_admin import credentials, db

cred = credentials.Certificate(os.getcwd() + "/server/server/readready-14b96-firebase-adminsdk-xmh3d-5b309e7202.json")
firebase_admin.initialize_app(
    cred,
    {
        "databaseURL": "https://readready-14b96-default-rtdb.asia-southeast1.firebasedatabase.app/"
    }
)

ratings = db.reference('/ratings')
rating_list = []
user_list = []
book_list = []
date_list = []
score_list = []
user_book = defaultdict(list)

for key, value in ratings.get().items():
    user = value.get('username')
    book = value.get('itemId')
    user_book[user].append(book)

filtered_user = set(map(lambda x:x[0], filter(lambda item: len(item[1]) > 1, user_book.items())))

for key, value in ratings.get().items():
    user = value.get('username')
    if user in filtered_user:
        user_list.append(user)
        book = value.get('itemId')
        book_list.append(book)
        date = value.get('date')
        date_list.append(date)
        score = value.get('rating')
        score_list.append(score)
        rating_list.append(value)
    else:
        continue

user_set = sorted(set(user_list))
book_set = sorted(set(book_list))

user_one_hot = np.zeros((len(user_list), len(user_set)))
book_one_hot = np.zeros((len(book_list), len(book_set)))
date_vector = np.array(date_list)
rating_vector = np.array(score_list)

sorted_rating_data = sorted(rating_list, key=lambda x: (x['username'], x['date']))
grouped_rating_data = {}
for entry in sorted_rating_data:
    grouped_rating_data.setdefault(entry['username'], []).append(entry['itemId'])

other_rated_matrix = []
last_rated_matrix = []

for i, (username, bookId) in enumerate(zip(user_list, book_list)):
    user_one_hot[i, user_set.index(username)] = 1
    book_one_hot[i, book_set.index(bookId)] = 1
    books = grouped_rating_data[username]
    book_index = books.index(bookId)
    row = [0 for j in range(len(book_set))]
    if book_index == 0:
        last_rated_matrix.append(row)
    else:
        last_book = books[book_index-1]
        row[book_set.index(last_book)] = 1
        last_rated_matrix.append(row)
    
for user in user_list:
    row = [0 for j in range(len(book_set))]
    rated_books = user_book[user]
    rating_value = round(1 / len(rated_books), 2)
    
    for book in rated_books:
        row[book_set.index(book)] = rating_value
    other_rated_matrix.append(row)

last_rated = np.array(last_rated_matrix)
other_rated = np.array(other_rated_matrix)

print(np.shape(user_one_hot))
print(np.shape(book_one_hot))
print(np.shape(other_rated))
print(np.shape(date_vector))
print(np.shape(last_rated))
print(np.shape(rating_vector))


