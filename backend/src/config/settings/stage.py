from .base import *

DEBUG = False

MAIN_HOST = 'https://assessors-test.trainingdata.solutions'

ALLOWED_HOSTS = ['.trainingdata.solutions']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'postgres'),
        'USER': os.getenv('POSTGRES_USER', 'postgres'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'postgres'),
        'HOST': os.getenv('POSTGRES_HOST', 'postgres'),
        'PORT': os.getenv('POSTGRES_PORT', 5432),
        'OPTIONS': {
            'sslmode': os.environ.get('SSL_MODE'),
            'target_session_attrs': os.environ.get('TARGET_SESSION_ATTRS')
        }
    }
}

CORS_ALLOWED_ORIGINS = [MAIN_HOST]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = ['https://*.trainingdata.solutions']
