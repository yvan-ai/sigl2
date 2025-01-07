from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utilisateurs.models import Entreprise ,MaitreApprentissage, Apprenti
from .serializers import EntrepriseSerializer

# Create your views here.

class UpdateEntrepriseView(APIView):
    def post(self, request, entreprise_pk):
        try:
            entreprise = Entreprise.objects.get(pk=entreprise_pk)
            
        except (Entreprise.DoesNotExist):
            return Response({"error": "Entreprise not found"}, status=status.HTTP_404_NOT_FOUND)

    
     # Utiliser le serializer pour mettre à jour les informations du tuteur
        serializer =EntrepriseSerializer(entreprise, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Entreprise updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

