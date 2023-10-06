from .base import *


DEBUG = True

MAIN_HOST = 'http://localhost:3000'

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'] = timedelta(days=1)

CORS_ALLOWED_ORIGINS = [MAIN_HOST]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [MAIN_HOST]
