from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Libro
from rest_framework import status
from biblioteca.models import Usuario

class UsuarioTests(APITestCase):
    def test_create_usuario(self):
        url = '/api/usuarios/'
        data = {
            'username': 'usuario_prueba',
            'password': 'contraseña_secreta',
            'email': 'usuario@ejemplo.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Usuario.objects.count(), 1)
        self.assertEqual(Usuario.objects.get().username, 'usuario_prueba')

class LibroTests(APITestCase):
    def test_create_libro(self):
        url = '/api/libros/'
        data = {
            'titulo': 'El Gran Libro',
            'autor': 'Autor Desconocido',
            'categoria': 'Ficción',
            'estado': 'disponible',
            'ubicacion': 'Sección A'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

def test_get_libros(self):
    url = '/api/libros/'
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertGreater(len(response.data), 0)