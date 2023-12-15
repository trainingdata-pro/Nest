from .base import *  # noqa


DEBUG = True

MAIN_HOST = 'http://localhost:3000'

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'postgres',
        'PORT': 5432
    }
}

SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'] = timedelta(days=1)  # noqa

CORS_ALLOWED_ORIGINS = [MAIN_HOST]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [MAIN_HOST]
