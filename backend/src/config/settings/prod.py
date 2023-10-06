from .base import *

DEBUG = False

MAIN_HOST = 'https://assessors-test.trainingdata.solutions'

ALLOWED_HOSTS = ['*']

CSRF_TRUSTED_ORIGINS = [MAIN_HOST]
CORS_ALLOWED_ORIGINS = [MAIN_HOST]
