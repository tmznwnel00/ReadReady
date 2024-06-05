"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app.views import book_recommendation, book_info, book_search, crud_posting, \
    signup, library, login_user, logout_user, rating_book, record_full_pages, record_pages, user_books_analysis

urlpatterns = [
    path('signup', signup, name='signup'),
    path('login', login_user, name='login'),
    path('logout', logout_user, name='logout'),
    path('rating', rating_book, name='rating'),
    path('search', book_search, name='book_search'),
    path('book', book_info, name='book_info'),
    path('posting', crud_posting, name='crud_post'),
    path('recommendation', book_recommendation, name='recommendation'),
    path('library', library, name='library'),
    path('library/full_page', record_full_pages, name='full_page'),
    path('library/current_page', record_pages, name='current_page'),
    path('analysis', user_books_analysis, name='user_books_analysis'),
    path('daily_progress', record_daily_progress, name='record_daily_progress'),
    path('daily_progress_graph', daily_progress_graph, name='daily_progress_graph')
]
