# backend/notifications/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from utilisateurs.models import Notification,Event
from .serializers import NotificationSerializer
from rest_framework import status
from datetime import timedelta
from django.utils import timezone


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    
class NotificationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
            if 'read' in request.data:
                notification.read = request.data['read']
            if 'reminder' in request.data:
                notification.reminder = request.data['reminder']
            notification.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
        
class ToggleReminderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
            reminder_date = event.date - timedelta(days=1)

            if reminder_date < timezone.now().date():
                return Response({"error": "Impossible de créer un rappel pour un événement passé."}, status=status.HTTP_400_BAD_REQUEST)

            # Vérifier si une notification de rappel existe déjà
            notification, created = Notification.objects.get_or_create(
                user=request.user,
                event=event,
                defaults={
                    'message': f"Rappel: L'événement '{event.intitulé}' aura lieu demain.",
                    'type': 'reminder',
                    'scheduled_date': reminder_date,
                    'reminder': True
                }
            )

            if not created:
                # Si la notification existe déjà, la supprimer
                notification.delete()
                return Response({"message": "Rappel supprimé avec succès.", "reminder": False}, status=status.HTTP_204_NO_CONTENT)

            return Response({"message": "Rappel créé avec succès.", "reminder": True}, status=status.HTTP_201_CREATED)

        except Event.DoesNotExist:
            return Response({"error": "Événement non trouvé."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the exception for debugging
            print(f"Erreur serveur: {str(e)}")
            return Response({"error": "Erreur interne du serveur."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)