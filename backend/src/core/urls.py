from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication

from .settings import DEBUG, STATIC_URL, STATIC_ROOT

schema_view = get_schema_view(
    openapi.Info(
        title='Documentation API',
        default_version='v1'
    ),
    public=False,
    authentication_classes=[JWTAuthentication, SessionAuthentication],
    permission_classes=[IsAdminUser]
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
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/',
            TemplateView.as_view(
                template_name='swaggerui.html',
                extra_context={'schema_url': 'openapi-schema'}
            ),
            name='schema-swagger-ui'),
    re_path(r'^redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

urlpatterns = [
    path('', include(_documentation)),
    path('admin/', admin.site.urls),
    path('api/', include(_api)),
    # path('api/', include(_token))
]

if DEBUG:
    urlpatterns += static(STATIC_URL, document_root=STATIC_ROOT)
    urlpatterns += [
        path('__debug__/', include('debug_toolbar.urls')),
    ]
