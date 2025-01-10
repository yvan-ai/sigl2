from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from utilisateurs.models import Event, Utilisateur, Notification
from .serializers import EventSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from datetime import date
from django.utils import timezone
from datetime import timedelta





class EventListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            event = serializer.save()
            # Envoyer une notification à tous les utilisateurs
            utilisateurs = Utilisateur.objects.all()
            for utilisateur in utilisateurs:
                Notification.objects.create(
                    user=utilisateur,
                    message=f"Nouvel événement créé : {event.intitulé}",
                    type='event'
                )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = EventSerializer(event)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




def upcoming_events(request):
    events = Event.objects.filter(date__gte=date.today()).order_by('date')
    data = [
        {
            "id": event.id,
            "date": event.date,
            "heure": event.heure.strftime("%H:%M"),
            "adresse": event.adresse,
            "intitulé": event.intitulé,
            "description": event.description,
            "image": event.image.url if event.image else None
        }
        for event in events
    ]
    
    return JsonResponse(data, safe=False)

class CreateReminderNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)
            # Calculer la date de rappel (un jour avant l'événement)
            reminder_date = event.date - timedelta(days=1)
            if reminder_date < timezone.now().date():
                return Response({"error": "Impossible de créer un rappel pour un événement passé."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Créer la notification
            Notification.objects.create(
                user=request.user,
                message=f"Rappel: L'événement '{event.intitulé}' aura lieu demain.",
                type='reminder'
            )
            return Response({"message": "Rappel créé avec succès."}, status=status.HTTP_201_CREATED)
        except Event.DoesNotExist:
            return Response({"error": "Événement non trouvé."}, status=status.HTTP_404_NOT_FOUND)
 