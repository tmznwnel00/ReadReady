import json

from firebase_admin import db

import bcrypt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_data = data.get('new_user')
        
        if new_data:
            username = new_data.get('username')
            id = new_data.get('id')
            password = new_data.get('password')
            
            ref = db.reference('/users')
            snapshot = ref.order_by_key().equal_to(username).get()
            if snapshot:
                return JsonResponse({'error': 'Username is already in use'}, status=400)
            
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            ref.child(username).set({
                'id': id,
                'password': hashed_password
            })

            return JsonResponse({'message': 'User created'})

    return JsonResponse({'error': 'Invalid request or missing data'}, status=400)
        
