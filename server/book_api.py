import requests
import os
import pandas as pd

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
ttbkey = os.getenv("TTBKEY")

column_names = ['num']
category_csv = pd.read_csv("server/aladin_category.csv", header=None, names=column_names)

for index, row in category_csv[2473:].iterrows():
    num = row['num']
    endpoint = f"http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey={ttbkey}&QueryType=ItemEditorChoice&MaxResults=100&start=1&SearchTarget=Book&output=JS&Version=20131101&CategoryId={num}"    
    response = requests.get(endpoint)
    print(index)
    for book in response.json()['item']:
        if book['itemId'] is None:
            continue
        ref = db.reference('/books')
        ref.child(str(book['itemId'])).set(book)