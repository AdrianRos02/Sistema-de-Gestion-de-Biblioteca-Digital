import django
import os
from datetime import date

# Configura Django para usar los settings de tu proyecto
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BibliotecaDigital.settings')
django.setup()

# Ahora puedes usar los modelos
from biblioteca.models import Prestamo

# Crear un préstamo de ejemplo
prestamo = Prestamo.objects.create(
    usuario_id=1,  # Asegúrate de que el ID del usuario exista en la base de datos
    libro_id=1,    # Asegúrate de que el ID del libro exista en la base de datos
    fecha_prestamo=date(2025, 1, 10),
    fecha_devolucion=date(2025, 1, 15)
)

# Simular una devolución tardía
prestamo.fecha_real_devolucion = date(2025, 1, 20)
prestamo.calcular_sancion(valor_por_dia=2.0)

# Imprimir la sanción calculada
print(f"Sanción calculada: {prestamo.sancion_acumulada}")