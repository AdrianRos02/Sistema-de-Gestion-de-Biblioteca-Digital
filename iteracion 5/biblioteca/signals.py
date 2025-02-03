from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Prestamo, Usuario
from django.core.mail import send_mail

@receiver(post_save, sender=Prestamo)
def verificar_retraso_prestamo(sender, instance, **kwargs):
    if instance.estado == 'prestado' and instance.fecha_devolucion < timezone.now():
        mensaje = f"Tu préstamo del libro '{instance.libro.titulo}' está vencido. Devuélvelo lo antes posible."
        
        # Enviar email
        send_mail(
            subject="Notificación de retraso en préstamo",
            message=mensaje,
            from_email="biblioteca@tuapp.com",
            recipient_list=[instance.usuario.email],
            fail_silently=True,
        )
