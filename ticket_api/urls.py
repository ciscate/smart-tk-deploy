
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('tickets/technical/', include('ticket_technical.urls')),
    path('tickets/facilities/', include('ticket_facilities.urls')),
    path('tickets/consolidated/', include('ticket_consolidated.urls')),
    path('tickets/voucher/', include('ticket_voucher.urls')),
]


# Agregar archivos estáticos solo en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)