# serializers.py
from rest_framework import serializers
from .models import Libro, Usuario, Prestamo, Notificacion,Categoria  # Asegúrate de importar Usuario desde tu app

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
    

    class Meta:
        model = Prestamo
        fields = ['id', 'fecha_prestamo', 'fecha_devolucion', 'libro', 'usuario']
    
    def validate(self, data):
        # Asegurarnos de que 'libro' no sea None antes de acceder a su estado
        libro = data.get('libro')
        if libro is not None:
            if libro.estado == 'prestado':
                raise serializers.ValidationError("Este libro ya está prestado.")
        else:
            raise serializers.ValidationError("El campo 'libro' no puede estar vacío.")
        
        return data
class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__' 



class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']