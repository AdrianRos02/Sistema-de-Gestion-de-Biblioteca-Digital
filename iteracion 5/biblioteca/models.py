from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

class Usuario(AbstractUser):
    # Opcionales: Atributos adicionales si lo necesitas
    nombre = models.CharField(max_length=100)
    rol = models.CharField(max_length=10, choices=[('admin', 'Administrador'), ('lector', 'Lector')], default='lector')
    username = models.CharField(max_length=150, unique=True, default='default_username')
    password = models.CharField(max_length=128, default='1234')
    # Redefinir el campo groups y user_permissions con un `related_name`
    groups = models.ManyToManyField(
        'auth.Group', related_name='usuario_set', blank=True, help_text='The groups this user belongs to.'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', related_name='usuario_permissions', blank=True, help_text='Specific permissions for this user.'
    )

    def __str__(self):
        return self.username

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    
class Libro(models.Model):
    ESTADO_CHOICES = [
        ('disponible', 'Disponible'),
        ('prestado', 'Prestado'),
        ('reservado', 'Reservado'),
        # Otros estados si es necesario
    ]
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    categoria = models.CharField(max_length=100, default="General")
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='disponible')
    ubicacion = models.CharField(max_length=100)

    def __str__(self):
        return self.titulo
    
class Prestamo(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="prestamos")
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    fecha_prestamo = models.DateTimeField(auto_now_add=True)
    fecha_devolucion = models.DateTimeField()
    fecha_real_devolucion = models.DateField(null=True, blank=True)
    estado = models.CharField(
        max_length=20,
        choices=[('prestado', 'Prestado'), ('devuelto', 'Devuelto')],
        default='prestado'
    )
    sancion_acumulada = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    #Devolucion
    def clean(self):
        """
        Método de validación para asegurarse de que el libro no esté prestado antes de crear un nuevo préstamo.
        """
        if self.libro.estado == 'prestado' and self.estado == 'prestado':
            raise ValidationError(f"El libro '{self.libro.titulo}' ya está prestado y no puede ser prestado nuevamente.")
    
    def save(self, *args, **kwargs):
        """
        Sobrescribimos el método save para incluir la validación.
        """
        self.clean()  # Llamamos al método clean para realizar la validación
        super().save(*args, **kwargs)

        # Si el préstamo es realizado, cambiamos el estado del libro a 'prestado'
        if self.estado == 'prestado':
            self.libro.estado = 'prestado'
            self.libro.save()

    def devolver_libro(self):
        """
        Método para devolver el libro y marcarlo como disponible.
        """
        self.estado = 'devuelto'
        self.libro.estado = 'disponible'  # Cambiamos el estado del libro a 'disponible'
        self.libro.save()
        self.save()

    #Sancion
    def calcular_sancion(self, valor_por_dia=1.0):
        """
        Calcula la sanción acumulada si hay retraso en la devolución.
        """
        if self.fecha_real_devolucion and self.fecha_real_devolucion > self.fecha_devolucion:
            dias_retraso = (self.fecha_real_devolucion - self.fecha_devolucion).days
            self.sancion_acumulada = dias_retraso * valor_por_dia
            self.save()

            # Crear notificación de sanción
            self.crear_notificacion("sancion", f"Tu préstamo del libro '{self.libro.titulo}' está vencido. Sanción acumulada: ${self.sancion_acumulada:.2f}")

    def enviar_recordatorio(self):
        """
        Enviar notificación recordatoria antes de la fecha de devolución.
        """
        hoy = timezone.now().date()
        if (self.fecha_devolucion.date() - hoy).days == 2:
            self.crear_notificacion("recordatorio", f"Recuerda devolver el libro '{self.libro.titulo}' en 2 días para evitar sanciones.")

    def crear_notificacion(self, tipo, mensaje):
        """
        Crea una notificación para el usuario.
        """
        Notificacion.objects.create(
            usuario=self.usuario,
            mensaje=mensaje,
            tipo=tipo
        )

    def __str__(self):
        return f"Préstamo: {self.usuario.nombre} - {self.libro.titulo} ({self.estado})"
    



class Notificacion(models.Model):
    TIPOS_NOTIFICACION = [
        ('sancion', 'Sanción'),
        ('recordatorio', 'Recordatorio'),
        ('info', 'Información'),
    ]

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    mensaje = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(max_length=20, choices=TIPOS_NOTIFICACION, default='info')
    leida = models.BooleanField(default=False)  # Para saber si el usuario la ha visto

    def __str__(self):
        return f"[{self.tipo}] {self.usuario.username} - {'Leída' if self.leida else 'No leída'}"

    



##Categoria
from django.db import models

