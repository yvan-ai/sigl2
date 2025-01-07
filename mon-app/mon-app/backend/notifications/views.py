from django.db.models.signals import post_save
from django.dispatch import receiver
from utilisateurs.models import Notification
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from utilisateurs.models import *
from .serializers import NotificationSerializer

@receiver(post_save, sender=Utilisateur)
def create_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance,
            message=f"Bienvenue {instance.username} !",
            type='welcome'
        )



class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user, read=False)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

