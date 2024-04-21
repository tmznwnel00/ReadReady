from django.apps import AppConfig
from django.conf import settings

class ServerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'server'
    
    def ready(self):
        print('hi')
        if settings.RUN_INDEXING_ON_STARTUP:
            from ..app.search import indexing_books
            indexing_books()
