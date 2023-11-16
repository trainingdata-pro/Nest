from .base import *


DEBUG = True

MAIN_HOST = 'http://localhost:3000'

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'postgres'),
        'USER': os.getenv('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'postgres'),
        'HOST': os.getenv('POSTGRES_HOST', 'postgres'),
        'PORT': os.getenv('POSTGRES_PORT', 5432)
    }
}

SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'] = timedelta(days=1)

CORS_ALLOWED_ORIGINS = [MAIN_HOST]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [MAIN_HOST]
