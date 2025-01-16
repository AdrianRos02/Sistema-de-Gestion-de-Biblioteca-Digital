from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Libro
from rest_framework import status
from biblioteca.models import Usuario
from django.test import TestCase
from datetime import date
from biblioteca.models import Prestamo, Libro

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


class TestPrestamoSanciones(TestCase):

    def setUp(self):
        # Crear un usuario y un libro para las pruebas
        self.usuario = Usuario.objects.create(username="usuario1", email="usuario1@mail.com")
        self.libro = Libro.objects.create(titulo="Libro de prueba", autor="Autor de prueba")
        
        # Crear un préstamo con fecha de devolución prevista
        self.prestamo = Prestamo.objects.create(
            usuario=self.usuario,
            libro=self.libro,
            fecha_prestamo=date(2024, 12, 1),
            fecha_devolucion=date(2024, 12, 15),
        )

    def test_sancion_sin_retraso(self):
        # Test para cuando no hay retraso en la devolución
        self.prestamo.fecha_real_devolucion = date(2024, 12, 14)  # Devolución a tiempo
        self.prestamo.calcular_sancion()
        self.assertEqual(self.prestamo.sancion_acumulada, 0.00)

    def test_sancion_con_retraso(self):
        # Test para cuando hay un retraso en la devolución
        self.prestamo.fecha_real_devolucion = date(2024, 12, 20)  # 5 días de retraso
        self.prestamo.calcular_sancion()
        self.assertEqual(self.prestamo.sancion_acumulada, 5.00)  # 5 días * 1.0

    def test_sancion_sin_devolucion(self):
        # Test para cuando no se ha registrado la devolución
        self.prestamo.fecha_real_devolucion = None
        self.prestamo.calcular_sancion()
        self.assertEqual(self.prestamo.sancion_acumulada, 0.00)