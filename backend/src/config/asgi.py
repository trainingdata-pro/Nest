"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

config = os.environ.get('APP_CONFIG', 'dev')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'config.settings.{config}')

application = get_asgi_application()
