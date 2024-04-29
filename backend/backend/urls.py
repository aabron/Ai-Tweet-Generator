from django.contrib import admin
from django.urls import path, include
from . import views
from tgenerator.urls import urlpatterns 
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/', include('tgenerator.urls')),
    path('', views.index),
    path('admin/', admin.site.urls),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
