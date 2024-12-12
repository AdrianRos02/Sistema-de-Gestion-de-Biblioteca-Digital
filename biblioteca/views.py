from django.shortcuts import render
from django.http import JsonResponse
from .models import Libro
from core.models import Usuario

# Vista para obtener todos los libros
def libros_list(request):
    libros = Libro.objects.all()
    libros_data = [{"id": libro.id, "titulo": libro.titulo, "autor": libro.autor} for libro in libros]
    return JsonResponse(libros_data, safe=False)

# Vista para obtener un usuario
def usuario_detail(request, user_id):
    try:
        usuario = Usuario.objects.get(id=user_id)
        data = {"id": usuario.id, "nombre": usuario.nombre, "correo": usuario.correo}
        return JsonResponse(data)
    except Usuario.DoesNotExist:
        return JsonResponse({"error": "Usuario no encontrado"}, status=404)