from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
import json

from pydantic import ValidationError
from .models import Libro
from .models import Usuario
from .models import Prestamo
from .models import Notificacion
from .models import Categoria
from .serializers import CategoriaSerializer
from datetime import date 
from datetime import datetime
from django.http import HttpResponse
from rest_framework import generics, filters
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UsuarioSerializer
from .serializers import LibroSerializer
from .serializers import PrestamoSerializer
from .serializers import NotificacionSerializer
from django.core.mail import send_mail 
from datetime import timedelta
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

from .models import Prestamo, Libro

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
    
# Vista para crear un préstamo, con la validación de disponibilidad del libro

def crear_prestamo(request):
    if request.method == 'POST':
        try:
            prestamo_data = json.loads(request.body)
            libro_nombre = prestamo_data.get('libro_nombre')
            usuario_nombre = prestamo_data.get('usuario_nombre')

            if not libro_nombre or not usuario_nombre:
                return JsonResponse({"error": "Faltan datos en la solicitud"}, status=400)

            # Buscar libro y usuario
            try:
                libro = Libro.objects.get(titulo=libro_nombre)
            except Libro.DoesNotExist:
                return JsonResponse({"error": "Libro no encontrado"}, status=404)

            try:
                usuario = Usuario.objects.get(username=usuario_nombre)
            except Usuario.DoesNotExist:
                return JsonResponse({"error": "Usuario no encontrado"}, status=404)

            # Verificar si el libro está prestado
            if libro.estado == 'prestado':
                return JsonResponse({"error": f"El libro '{libro.titulo}' ya está prestado."}, status=400)

            # Crear el préstamo
            fecha_devolucion = timezone.now().date() + timedelta(days=14)
            prestamo = Prestamo.objects.create(
                usuario=usuario,
                libro=libro,
                fecha_devolucion=fecha_devolucion,
                estado='prestado'
            )

            # Actualizar el estado del libro a "prestado"
            libro.estado = 'prestado'
            libro.save()

            data = {
                "libro": libro.titulo,
                "usuario": usuario.username,
                "fecha_prestamo": prestamo.fecha_prestamo,
                "fecha_devolucion": prestamo.fecha_devolucion,
                "estado": prestamo.estado
            }
            return JsonResponse(data)

        except json.JSONDecodeError:
            return JsonResponse({"error": "No se pudo procesar la solicitud. Verifica los datos enviados."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido"}, status=405)


# Vista para obtener todos los usuarios y libros
@api_view(['GET'])
def obtener_usuarios_libros(request):
    usuarios = Usuario.objects.all()
    libros = Libro.objects.all()

    usuarios_data = [{'id': usuario.id, 'nombre': usuario.username} for usuario in usuarios]
    libros_data = [{'id': libro.id, 'titulo': libro.titulo} for libro in libros]

    return Response({
        'usuarios': usuarios_data,
        'libros': libros_data
    })





#Serializers

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
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

    @action(detail=True, methods=['post'])
    def devolver(self, request, pk=None):
        prestamo = self.get_object()  # Obtenemos el préstamo con pk
        if prestamo.estado != 'prestado':
            return Response(
                {"error": "El libro ya ha sido devuelto."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Actualizamos el estado a 'devuelto'
        prestamo.estado = 'devuelto'
        prestamo.fecha_real_devolucion = timezone.now()  # Asignamos la fecha de devolución real
        prestamo.save()

        # Eliminamos el préstamo de la base de datos
        prestamo.delete()

        return Response({"message": "El libro ha sido devuelto y el préstamo eliminado."}, status=status.HTTP_200_OK)

class NotificacionListView(APIView):
    def get(self, request):
        notificaciones = Notificacion.objects.all()
        serializer = NotificacionSerializer(notificaciones, many=True)
        return Response(serializer.data)

from django.http import JsonResponse
from django.shortcuts import get_object_or_404

# views.py en Django
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Prestamo, Libro

@api_view(['PUT'])  # Usamos PUT para indicar que se actualizará el estado
def devolver_prestamo(request, pk):
    try:
        # Obtener el préstamo por su ID
        prestamo = Prestamo.objects.get(pk=pk)

        # Actualizar el estado del préstamo a 'devuelto'
        prestamo.estado = 'devuelto'
        prestamo.save()

        # Obtener el libro asociado al préstamo
        libro = prestamo.libro

        # Actualizar el estado del libro a 'disponible'
        libro.estado = 'disponible'
        libro.save()

        # Eliminar el préstamo de la base de datos
        prestamo.delete()

        # Responder con éxito
        return Response({'message': 'Préstamo devuelto con éxito, estado de libro actualizado y préstamo eliminado.'}, status=status.HTTP_200_OK)
    except Prestamo.DoesNotExist:
        return Response({'error': 'Préstamo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LibroListCreate(generics.ListCreateAPIView):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['titulo', 'autor', 'categoria']