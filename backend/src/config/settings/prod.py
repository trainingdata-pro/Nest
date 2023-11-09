from .base import *

DEBUG = False

MAIN_HOST = 'https://assessors-test.trainingdata.solutions'

ALLOWED_HOSTS = ['.trainingdata.solutions']

CORS_ALLOWED_ORIGINS = [MAIN_HOST, 'http://assessors-test.trainingdata.solutions']
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [MAIN_HOST, 'http://assessors-test.trainingdata.solutions']
