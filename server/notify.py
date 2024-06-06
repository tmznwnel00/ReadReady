import os
import time
import json
from collections import defaultdict

import yagmail
import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, db

cred = credentials.Certificate(os.getcwd() + "/secrets.json")
firebase_admin.initialize_app(
    cred,
    {
        "databaseURL": "https://readready-14b96-default-rtdb.asia-southeast1.firebasedatabase.app/"
    }
)

load_dotenv()

def send_email(to_email, subject, body):
    yag = yagmail.SMTP(os.getenv('EMAIL'), os.getenv('APP_PASSWORD'))
    yag.send(to=to_email, subject=subject, contents=body)

user_dict = defaultdict(list)

library = db.reference('/library')
log = db.reference('/log')
users = db.reference('/users')
books = db.reference('/books')

threshold = time.time() - 20*3600

for key, value in library.get().items():
    if value['status'] == 'reading':
        flag = False
        for key2, value2 in log.get().items():
                if value2['libraryId'] == key and threshold <= value2['date']:
                    flag = True

        if flag == False:
             user_dict[value['username']].append(value['itemId'])
             
for user, book_list in user_dict.items():
    user_email = users.child(user).get()['email']
    book_str = ''
    for index, book in enumerate(book_list):
         title = books.child(str(book)).get()['title']
         book_str += f'{index+1}. {title} \n'
         
    subject = 'Are You Read Ready?'
    body = f"It's time to record your daily progress!!\n\nBook list in your library\n{book_str}"
    
    send_email(user_email, subject, body)