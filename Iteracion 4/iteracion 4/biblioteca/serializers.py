# serializers.py
from rest_framework import serializers
from .models import Libro, Usuario, Prestamo, Notificacion  # Asegúrate de importar Usuario desde tu app

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario  # Usamos el modelo Usuario de tu app, no User de django.contrib.auth
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password']

    # Aseguramos que la contraseña se maneje de forma segura
    def create(self, validated_data):
        user = Usuario.objects.create_user(  # Usamos create_user para el modelo Usuario
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        return user
# Serializador para los libros
class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = ['id', 'titulo', 'autor', 'categoria', 'estado', 'ubicacion']

# Serializador para los préstamos
class PrestamoSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.all())
    libro = serializers.PrimaryKeyRelatedField(queryset=Libro.objects.all())
    class Meta:
        model = Prestamo
        fields = ['id', 'usuario', 'libro', 'fecha_prestamo', 'fecha_devolucion', 'estado']

    def validate(self, data):
        # Verificar que el libro no esté prestado
        if data['libro'].estado == 'prestado':
            raise serializers.ValidationError("El libro ya está prestado.")
        return data

    def create(self, validated_data):
        # Cambiar el estado del libro a 'prestado'
        libro = validated_data['libro']
        libro.estado = 'prestado'
        libro.save()

        # Crear el préstamo
        prestamo = Prestamo.objects.create(
            usuario=validated_data['usuario'],
            libro=libro,
            fecha_devolucion=validated_data.get('fecha_devolucion', None),  # Si no hay fecha, se deja en None
            estado='prestado'
        )
        return prestamo
    
class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__' 