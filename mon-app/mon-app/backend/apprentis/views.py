from django.shortcuts import render

# Create your views here.

from rest_framework.parsers import MultiPartParser, FormParser
from utilisateurs.models import *
from .serializers import *
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
#@login_required(login_url='accounts:login')
class DeposerFichier(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, journal_id):
        try:
            journal = JournalDeFormation.objects.get(numero=journal_id)
        except JournalDeFormation.DoesNotExist:
            return Response({"error": "Journal de formation non trouvé"}, status=status.HTTP_404_NOT_FOUND)

        type_document = request.data.get('type_document')  # Assurez-vous que le champ correspond au frontend

        # Sélectionner le bon sérialiseur selon le type de document
        serializer = None
        if type_document == 'fiche_synthese':
            serializer = FicheSyntheseSerializer(data=request.data)
        elif type_document == 'ping':
            serializer = PingSerializer(data=request.data)
        elif type_document == 'rapport_final':
            serializer = RapportFinalSerializer(data=request.data)
        elif type_document == 'presentation':
            serializer = PresentationSerializer(data=request.data)
        else:
            return Response({"error": "Type de document non valide"}, status=status.HTTP_400_BAD_REQUEST)

        # Validation et sauvegarde du fichier
        if serializer and serializer.is_valid():
            serializer.save(numero=journal)  # Assurez-vous que `numero` est bien le champ de relation
            return Response({"message": "Fichier déposé avec succès"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            


@api_view(['GET'])
def get_current_journal(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'error': 'Utilisateur non authentifié'}, status=401)
    
    try:
        apprenti = user.apprenti_profile  # Utilisez le `related_name` défini dans le modèle
        journal = apprenti.numero_journal.first()  # Récupère le premier journal lié
        if not journal:
            return Response({'error': 'Aucun journal associé'}, status=404)
        return Response({'journal_id': journal.numero})  # Assurez-vous que le champ est correct
    except AttributeError:
        return Response({'error': 'Utilisateur non apprenti ou relation invalide'}, status=404)


