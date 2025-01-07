from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utilisateurs.models import MaitreApprentissage, Apprenti, TuteurPedagogique
from .serializers import EntrepriseSerializer
from .serializers import MaitreApprentissageSerializer, TutoratSerializer, ApprentiSerializer


# Vue pour mettre à jour le tuteur pédagogique avec l'apprenti et ses informations (ex. téléphone)
class UpdateTuteurWithApprentiView(APIView):
    def post(self, request, tuteur_pk, apprenti_pk):
        try:
            tuteur = TuteurPedagogique.objects.get(pk=tuteur_pk)
            apprenti = Apprenti.objects.get(pk=apprenti_pk)
        except (TuteurPedagogique.DoesNotExist, Apprenti.DoesNotExist):
            return Response({"error": "Tuteur or Apprenti not found"}, status=status.HTTP_404_NOT_FOUND)

        # Mettre à jour l'apprenti avec le tuteur
        apprenti.tuteur_pedagogique = tuteur

        # Utiliser le serializer pour mettre à jour les informations du tuteur
        serializer = TutoratSerializer(tuteur, data=request.data)
        if serializer.is_valid():
            serializer.save()
            apprenti.save()  # Sauvegarder aussi la relation avec l'apprenti
            return Response({"message": "Tuteur and Apprenti updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Vue pour mettre à jour le maître d'apprentissage avec l'apprenti et ses informations (ex. téléphone, entreprise)
class UpdateMaitreWithApprentiView(APIView):
    def post(self, request, maitre_pk, apprenti_pk):
        try:
            maitre = MaitreApprentissage.objects.get(pk=maitre_pk)
            apprenti = Apprenti.objects.get(pk=apprenti_pk)
        except (MaitreApprentissage.DoesNotExist, Apprenti.DoesNotExist):
            return Response({"error": "Maitre or Apprenti not found"}, status=status.HTTP_404_NOT_FOUND)

        # Mettre à jour l'apprenti avec le maître d'apprentissage
        apprenti.maitre_apprentissage = maitre

        # Utiliser le serializer pour mettre à jour les informations du maître d'apprentissage
        serializer = MaitreApprentissageSerializer(maitre, data=request.data)
        if serializer.is_valid():
            serializer.save()
            apprenti.save()  # Sauvegarder aussi la relation avec l'apprenti
            return Response({"message": "Maitre and Apprenti updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddEntrepriseView(APIView):
    def post(self, request):
        serializer = EntrepriseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Entreprise created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
