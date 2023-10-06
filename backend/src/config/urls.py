from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import IsAuthenticated

from core.permissions import IsAnalystOrAdmin


schema_view = get_schema_view(
    openapi.Info(
        title='NEST API Documentation',
        default_version='v1'
    ),
    public=False,
    permission_classes=[IsAuthenticated, IsAnalystOrAdmin]
)

_api = [
    path('', include('apps.assessors.urls')),
    path('', include('apps.authapp.urls')),
    path('', include('apps.fired.urls')),
    path('', include('apps.history.urls')),
    path('', include('apps.projects.urls')),
    path('', include('apps.users.urls'))
]

_documentation = [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('', include('apps.authapp.swagger_urls'))
]

urlpatterns = [
    path('', include(_documentation)),
    path('admin/', admin.site.urls),
    path('api/', include(_api)),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [path('__debug__/', include('debug_toolbar.urls'))]
