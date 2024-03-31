import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from firebase_admin import db

@csrf_exempt
def firebase_data(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_data = data.get('new_data')

        if new_data:
            ref = db.reference('/users')
            ref.push(new_data)

            return JsonResponse({'message': 'Data posted to Firebase'})

    # If not a POST request or missing data, return error
    return JsonResponse({'error': 'Invalid request or missing data'}, status=400)
