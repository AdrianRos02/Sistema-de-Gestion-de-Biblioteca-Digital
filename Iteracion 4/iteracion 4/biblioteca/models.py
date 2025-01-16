from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone

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

class Libro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=100)
    categoria = models.CharField(max_length=50)
    estado = models.CharField(max_length=10, choices=[('disponible', 'Disponible'), ('prestado', 'Prestado')], default='disponible')
    ubicacion = models.CharField(max_length=100)

    def __str__(self):
        return self.titulo
    
class Prestamo(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="prestamos")
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE, related_name="prestamos")
    fecha_prestamo = models.DateTimeField()
    fecha_devolucion = models.DateTimeField()
    estado = models.CharField(
        max_length=20,
        choices=[('prestado', 'Prestado'), ('devuelto', 'Devuelto')],
        default='prestado'
    )
    sancion_acumulada = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Sanción acumulada

    def calcular_sancion(self, valor_por_dia=1.0):
        """
        Calcula la sanción acumulada en base a los días de retraso.
        """
        if self.fecha_real_devolucion and self.fecha_real_devolucion > self.fecha_devolucion:
            dias_retraso = (self.fecha_real_devolucion - self.fecha_devolucion).days
            self.sancion_acumulada = dias_retraso * valor_por_dia
            self.save()
            
            # Crear notificación de sanción para el usuario
            self.crear_notificacion_sancion()

    def crear_notificacion_sancion(self):
        """
        Crear una notificación para el usuario cuando se le aplique una sanción.
        """
        if self.sancion_acumulada > 0:
            mensaje = f"Tu préstamo del libro '{self.libro.titulo}' está vencido. La sanción acumulada es de {self.sancion_acumulada}."
            Notificacion.objects.create(
                usuario=self.usuario,
                mensaje=mensaje
            )

    def __str__(self):
        return f"Préstamo: {self.usuario.nombre} - {self.libro.titulo} ({self.estado})"
            
class Notificacion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)  # Asegúrate de usar Usuario aquí
    mensaje = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notificación para {self.usuario.username}"