from django.shortcuts import render
from django.http import JsonResponse
from .models import Libro
from .models import Usuario
from .models import Prestamo
from datetime import date 
from datetime import datetime
from django.http import HttpResponse
from rest_framework import generics
from rest_framework import viewsets
from .serializers import UsuarioSerializer
from .serializers import LibroSerializer
from .serializers import PrestamoSerializer
from .serializers import NotificacionSerializer
from .models import Notificacion, Prestamo
from django.core.mail import send_mail 
from datetime import timedelta
from django.utils import timezone


def api_home(request):
    data = {
        "message": "Bienvenido a la API de la Biblioteca Digital",
        "status": "success",
    }
    return JsonResponse(data)

def home(request):
    return HttpResponse("Bienvenido a la Biblioteca Digital")

def lista_libros(request):
    libros = Libro.objects.all()
    return render(request, 'libros.html', {'libros': libros})

# Vista para obtener un usuario
def usuario_detail(request, user_id):
    try:
        usuario = Usuario.objects.get(id=user_id)
        data = {"id": usuario.id, "nombre": usuario.nombre, "correo": usuario.correo}
        return JsonResponse(data)
    except Usuario.DoesNotExist:
        return JsonResponse({"error": "Usuario no encontrado"}, status=404)

def reporte_libros_prestados(request):
    prestamos = Prestamo.objects.filter(fecha_devolucion__gte=date.today())
    reporte = [
        {
            'libro': prestamo.libro.titulo,
            'usuario': prestamo.usuario.username,
            'fecha_prestamo': prestamo.fecha_prestamo,
            'fecha_devolucion': prestamo.fecha_devolucion,
        }
        for prestamo in prestamos
    ]
    return JsonResponse(reporte, safe=False)
    
def generar_notificaciones_sanciones():
    # Obtener préstamos con retraso
    prestamos_vencidos = Prestamo.objects.filter(
        fecha_real_devolucion__isnull=True,
        fecha_devolucion__lt=timezone.now().date()
    )

    # Generar notificaciones para cada préstamo vencido
    for prestamo in prestamos_vencidos:
        # Crear un mensaje de notificación para el usuario
        mensaje = f"Tu préstamo del libro {prestamo.libro.titulo} está vencido. Por favor devuélvelo lo antes posible."
        
        # Crear una notificación en la base de datos
        notificacion = Notificacion.objects.create(
            usuario=prestamo.usuario,
            mensaje=mensaje
        )
        print(f"Notificación creada para {prestamo.usuario.username}: {mensaje}")
        
#Serializers
# Vista para listar y crear usuarios
class UsuarioListCreate(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()  # Asegúrate de usar Usuario y no User
    serializer_class = UsuarioSerializer

# Vista para obtener, actualizar y eliminar usuarios
class UsuarioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()  # Usamos Usuario y no User
    serializer_class = UsuarioSerializer



# Vista para listar y crear libros
class LibroListCreate(generics.ListCreateAPIView):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer

# Vista para obtener, actualizar y eliminar libros
class LibroDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer

# Visra para Prestamo
class PrestamoViewSet(viewsets.ModelViewSet):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer

class NotificacionListView(generics.ListAPIView):
    serializer_class = NotificacionSerializer

    def get_queryset(self):
        # Obtener todas las notificaciones del usuario logueado
        usuario = self.request.user
        return Notificacion.objects.filter(usuario=usuario)   

class PrestamoListView(generics.ListCreateAPIView):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer