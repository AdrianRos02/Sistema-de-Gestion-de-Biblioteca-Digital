from django.urls import path

from django.contrib import admin 
from . import views
from .views import UsuarioListCreate, UsuarioDetail, LibroListCreate, LibroDetail

urlpatterns = [
    path('', views.home, name='home'),  # Muestra un mensaje simple
    path('api/', views.api_home, name='api_home'),  # Muestra datos JSON
    path('admin/', admin.site.urls),
    path('usuarios/', UsuarioListCreate.as_view(), name='usuario-list-create'),  # Usa el viewset de Usuario
    path('usuarios/<int:pk>/', UsuarioDetail.as_view(), name='usuario-detail'),  # Usa el viewset de Usuario
    path('libros/', LibroListCreate.as_view(), name='libro-list-create'),
    path('libros/<int:pk>/', LibroDetail.as_view(), name='libro-detail'),
    
]