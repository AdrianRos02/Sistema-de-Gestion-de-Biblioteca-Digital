# serializers.py
from rest_framework import serializers
from .models import Libro, Usuario  # Asegúrate de importar Usuario desde tu app

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