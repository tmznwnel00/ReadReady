import json

from firebase_admin import db

import bcrypt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

fixed_salt = b'$2b$12$7Cth.Iwf3o/8VW1x2Ly/le'

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
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), fixed_salt).decode('utf-8')        
        user = authenticate(request, username=username, password=hashed_password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'User logged in'})
    return JsonResponse({'error': "Wrong username or password"}, status=401)

@csrf_exempt
def logout_user(request):
    logout(request)
    return JsonResponse({'message': 'User logged out'})