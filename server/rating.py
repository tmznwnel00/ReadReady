import requests
import os
import time
import json
from datetime import datetime

import firebase_admin
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from firebase_admin import credentials, db

cred = credentials.Certificate(os.getcwd() + "/server/server/readready-14b96-firebase-adminsdk-xmh3d-5b309e7202.json")
firebase_admin.initialize_app(
    cred,
    {
        "databaseURL": "https://readready-14b96-default-rtdb.asia-southeast1.firebasedatabase.app/"
    }
)

load_dotenv()

books = db.reference('/books')
headers = {"Content-Type": "application/json"}
chrome_options = Options()
chrome_options.add_argument("--headless")
driver = webdriver.Chrome(options=chrome_options)


        
        
for key, value in books.get().items():
    if int(key) <= 23959237:
        continue
    print(key)
    url = value.get('link')
    driver.get(url)
    try:
        hundred = WebDriverWait(driver, 1).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="wa_product_top1_wa_Top_Ranking_pnlRanking"]/div[2]/a[3]'))
        )
        hundred.click()
    except:
        continue
    while True:
        time.sleep(1)
        try:
            moreButton = driver.find_element(By.XPATH, '//*[@id="divReviewPageMore"]')
        except:
            break
        style = moreButton.get_attribute("style")
        if style == "display: none;":
            break
        try:
            button = driver.find_element(By.XPATH, '//*[@id="divReviewPageMore"]/div[1]/a')
            button.click()
        except:
            break
        
    try:
        reviewElement = WebDriverWait(driver, 1).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="CommentReviewList"]/div[1]'))
        )
        reviewList = reviewElement.find_elements(By.CLASS_NAME, 'hundred_list')
    except:
        continue

    for review in reviewList:
        star = review.find_element(By.CLASS_NAME, 'HL_star')
        rating = len(star.find_elements(By.XPATH, './/img[contains(@src, "icon_star_on.png")]'))
        username = review.find_element(By.XPATH, './/div[2]/div/ul/li[2]/div[1]/a[1]').text
        date = review.find_element(By.XPATH, './/div[2]/div/ul/li[2]/div[1]/span[1]').text
        description = review.find_element(By.XPATH, './/div[2]/div/ul/li[1]/div/div/a[1]').text
        rating_data = {
                    "username": username,
                    "itemId": int(key),
                    "rating": int(rating),
                    "description": description,
                    "date": datetime.strptime(date, "%Y-%m-%d").timestamp()
                }
        res = requests.post("http://127.0.0.1:8000/rating", data=json.dumps(rating_data), headers=headers)

driver.quit()
