from django.contrib.auth.models import AbstractUser
from django.db import models

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
    fecha_prestamo = models.DateField(auto_now_add=True)
    fecha_devolucion = models.DateField(null=True, blank=True)
    estado = models.CharField(
        max_length=20,
        choices=[('prestado', 'Prestado'), ('devuelto', 'Devuelto')],
        default='prestado'
    )

    def __str__(self):
        return f"Préstamo: {self.usuario.nombre} - {self.libro.titulo} ({self.estado})"