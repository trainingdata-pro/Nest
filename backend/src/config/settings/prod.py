from .base import *

DEBUG = False

MAIN_HOST = 'https://assessors-test.trainingdata.solutions'

ALLOWED_HOSTS = ['*']

CORS_ALLOWED_ORIGINS = [MAIN_HOST]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [MAIN_HOST]
