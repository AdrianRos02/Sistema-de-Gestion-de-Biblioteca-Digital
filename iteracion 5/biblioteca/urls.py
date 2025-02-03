from django.urls import path , include
from rest_framework.routers import DefaultRouter
from django.contrib import admin 
from . import views
from .views import UsuarioListCreate, UsuarioDetail, LibroListCreate, LibroDetail, PrestamoViewSet, NotificacionListView,CategoriaViewSet

router = DefaultRouter()
router.register(r'prestamos', PrestamoViewSet, basename='prestamo')
router.register(r'categorias', CategoriaViewSet)

urlpatterns = [
    path('', views.home, name='home'),  # Muestra un mensaje simple
    path('api/', views.api_home, name='api_home'),  # Muestra datos JSON
    path('admin/', admin.site.urls),
    path('usuarios/', UsuarioListCreate.as_view(), name='usuario-list-create'),  # Usa el viewset de Usuario
    path('usuarios/<int:pk>/', UsuarioDetail.as_view(), name='usuario-detail'),  # Usa el viewset de Usuario
    path('libros/', LibroListCreate.as_view(), name='libro-list-create'),
    path('libros/<int:pk>/', LibroDetail.as_view(), name='libro-detail'),
    path('', include(router.urls)),
    path('reportes/libros/', views.reporte_libros_prestados, name='reporte_libros'),
    path('notificaciones/', NotificacionListView.as_view(), name='notificaciones_list'),
    path('prestamos/', views.crear_prestamo, name='crear_prestamo'),
    path('prestamos/<int:pk>/devolucion/', views.devolver_prestamo, name='devolver_prestamo'),
    path('usuarios-libros/', views.obtener_usuarios_libros, name='obtener_usuarios_libros'),

]