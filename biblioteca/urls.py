from django.urls import path
from . import views

urlpatterns = [
    path('libros/', views.libros_list, name='libros_list'),
    path('usuario/<int:user_id>/', views.usuario_detail, name='usuario_detail'),
]