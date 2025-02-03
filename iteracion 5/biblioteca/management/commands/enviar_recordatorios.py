from django.core.management.base import BaseCommand
from django.utils import timezone
from biblioteca.models import Prestamo

class Command(BaseCommand):
    help = "Envia recordatorios de devolución de libros"

    def handle(self, *args, **kwargs):
        hoy = timezone.now().date()
        prestamos = Prestamo.objects.filter(estado='prestado')

        for prestamo in prestamos:
            prestamo.enviar_recordatorio()

        self.stdout.write(self.style.SUCCESS("Recordatorios enviados correctamente"))
