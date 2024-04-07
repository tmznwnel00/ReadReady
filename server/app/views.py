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
            ref.child(username).set({
                'id': id,
                'password': bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            })

            return JsonResponse({'message': 'User created'})

    return JsonResponse({'error': 'Invalid request or missing data'}, status=400)
        
