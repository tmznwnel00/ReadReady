import random
import requests
import os
import pandas as pd
import json

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, db

cred = credentials.Certificate(os.getcwd() + "/server/server/readready-14b96-firebase-adminsdk-xmh3d-5b309e7202.json")
firebase_admin.initialize_app(
    cred,
    {
        "databaseURL": "https://readready-14b96-default-rtdb.asia-southeast1.firebasedatabase.app/"
    }
)

load_dotenv()

df = pd.read_csv("server/categoryNum.csv")
result = {}
keys = df.columns.tolist()
for column in df.columns:
    result[column] = df[column].dropna().astype(int).tolist()

rating_dict = {
    5: ["너무 잘 읽었습니다!!", "지인들에게 꼭 추천해주고 싶은 책입니다!!", "제가 읽었던 책들 중 손에 꼽을 만큼 인상깊었습니다!!"],
    4: ["잘 읽었습니다!!", "읽은 시간이 아깝지 않은 책입니다!!", "평점 5점 정도는 아니지만 충분히 인상깊었습니다!!"],
    3: ["평범했습니다!!", "다시 읽고 싶거나 누군가에게 추천할 만큼의 책은 아닌 것 같습니다!", "이 분야의 다른 책들을 읽어봐야 할 것 같습니다.. 이 책은 그닥..!"],
    2: ["아쉬웠습니다..!", "시간과 돈을 들여서까지 읽을만한 책은 아닌 것 같습니다..!", "저랑은 조금 안맞는 것 같습니다..!"],
    1: ["별로였습니다..!", "시간 아깝습니다..!", "읽어보지 않는 것을 추천드립니다..!"]
}

books = db.reference('/books')
data = books.order_by_child('categoryId').equal_to(4410).get()

headers = {"Content-Type": "application/json"}


for i in range(250):
    print(i)
    user_data = {
        "username": "user_" + str(i+42),
        "email": "user_" + str(i+42) + "@gmail.com",
        "password": "user_" + str(i+42) + "!!"
    }
    res1 = requests.post("http://127.0.0.1:8000/signup", data=json.dumps(user_data), headers=headers)
    
    category_set = set([])
    cnt = random.randint(1,15)
    for j in range(cnt):
        # select one category and good/bad rating score
        ran1 = random.randint(0,47)
        if ran1 in category_set:
            continue
        category_set.add(ran1)
        book_set = set([])
        cnt2 = random.randint(1,5)
        for k in range(cnt2):
            random_category = random.choice(result[keys[ran1]])
            # select one book
            book_data = books.order_by_child('categoryId').equal_to(random_category).get()
            if len(book_data.keys()) == 0:
                continue
            bookId = random.choice(list(book_data.keys()))
            if bookId in book_set:
                continue
            book_set.add(bookId)
            # select good/bad rating score
            if ran1 % 2 == 0:
                ran2 = random.randint(3,5)
            else:
                ran2 = random.randint(1,3)
            # select one rating description
            ran3 = random.randint(0,2)
    
            rating_data = {
                "username": "user_" + str(i+42),
                "itemId": bookId,
                "rating": ran2,
                "description": rating_dict[ran2][ran3]
            }
            res2 = requests.post("http://127.0.0.1:8000/rating", data=json.dumps(rating_data), headers=headers)
    
