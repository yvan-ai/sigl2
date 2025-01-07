from rest_framework import viewsets,status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Apprenti, MaitreApprentissage, TuteurPedagogique, JournalDeFormation, Utilisateur,RapportFinal, RapportPING, Presentation, FicheSynthese
from .serializers import *
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

######################################################
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@login_required
def authPage(request):
    user = request.user
    
    # Rediriger en fonction du type d'utilisateur
    if user.user_type == 1:
        return redirect('dashboard_admin')
    elif user.user_type == 2:
        return redirect('dashboard_apprenti')
    elif user.user_type == 3:
        return redirect('dashboard_tuteur')
    elif user.user_type == 4:
        return redirect('dashboard_enseignant')
    elif user.user_type == 5:
        return redirect('dashboard_maitre')
    elif user.user_type == 6:
        return redirect('dashboard_coordinatrice')
    elif user.user_type == 7:
        return redirect('dashboard_entreprise')
    else:
        return redirect('login')  # Rediriger vers la page de connexion par défaut


@login_required
def dashboard_apprenti(request):
    user = request.user
    response_data = {
        'user': user.username,
        'message': f"Bienvenue {user.email} sur votre tableau de bord Apprenti !",
    }
    return JsonResponse(response_data)

##############################################################


class EncadrantViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def get_apprentices(self, request):
        """
        Récupère la liste des apprentis de l'encadrant (maître d'apprentissage ou tuteur pédagogique)
        """
        try:
            email = request.query_params.get('email')
            
            if not email:
                return Response({'error': 'Le paramètre email est requis'}, status=400)

            encadrant = get_object_or_404(Utilisateur, email=email)
            
            if encadrant.user_type == 5:  # Maître d'apprentissage
                apprentis = Apprenti.objects.filter(maitre_apprentissage=encadrant, user_type=2)
            elif encadrant.user_type == 3:  # Tuteur pédagogique
                apprentis = Apprenti.objects.filter(tuteur_pedagogique=encadrant, user_type=2)
            else:
                return Response({'error': 'Type d\'utilisateur non autorisé'}, status=403)
            
            serializer = ApprentiBriefSerializer(apprentis, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': f'Erreur lors de la récupération des apprentis: {str(e)}'}, status=400)

    @action(detail=True, methods=['get'])
    def journal(self, request, pk=None):
        """
        Récupère le journal de formation d'un apprenti
        """
        try:
            email = request.query_params.get('email')
            
            if not email:
                return Response({'error': 'Le paramètre email est requis'}, status=400)

            encadrant = get_object_or_404(Utilisateur, email=email)
            
            if encadrant.user_type == 5:  # Maître d'apprentissage
                apprenti = get_object_or_404(Apprenti, id=pk, maitre_apprentissage=encadrant, user_type=2)
            elif encadrant.user_type == 3:  # Tuteur pédagogique
                apprenti = get_object_or_404(Apprenti, id=pk, tuteur_pedagogique=encadrant, user_type=2)
            else:
                return Response({'error': 'Type d\'utilisateur non autorisé'}, status=403)
            
            if not apprenti.numero_journal:
                return Response({'error': 'Aucun journal trouvé pour cet apprenti'}, status=404)
                
            serializer = JournalFormationSerializer(apprenti.numero_journal)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': f'Erreur lors de la récupération du journal: {str(e)}'}, status=400)


    
class DocumentEditViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def update_document(self, request, pk=None):
        try:
            document_type = request.data.get('document_type')
            comment = request.data.get('comment')

            if not document_type:
                return Response({'error': 'Le paramètre document_type est requis'}, status=400)

            # Utilisez request.user pour obtenir l'utilisateur authentifié
            encadrant = request.user
            apprenti = get_object_or_404(Apprenti, id=pk)

            if not self._has_permission(encadrant, apprenti):
                return Response({'error': 'Accès interdit'}, status=403)

            document_model = self._get_document_model(document_type)
            if not document_model:
                return Response({'error': 'Type de document inconnu'}, status=400)

            document = get_object_or_404(document_model, numero=apprenti.numero_journal)
            
            document.commentaire = comment
            document.save()

            serializer_class = self._get_serializer_class(document_type)
            serializer = serializer_class(document)
            return Response(serializer.data)

        except Exception as e:
            return Response({'error': f'Erreur lors de l\'édition du document: {str(e)}'}, status=400)

    def _has_permission(self, encadrant, apprenti):
        print(f"Encadrant type: {encadrant.user_type}")
        print(f"Apprenti maitre_apprentissage: {apprenti.maitre_apprentissage}")
        print(f"Apprenti tuteur_pedagogique: {apprenti.tuteur_pedagogique}")
        if encadrant.user_type == 5:  # Maître d'apprentissage
            return True
        elif encadrant.user_type == 3:  # Tuteur pédagogique
            return True
        return False

    def _get_document_model(self, document_type):
        return {
            'rapport_final': RapportFinal,
            'rapport_ping': RapportPING,
            'presentation': Presentation,
            'fiche_synthese': FicheSynthese
        }.get(document_type)

    def _get_serializer_class(self, document_type):
        return {
            'rapport_final': RapportFinalSerializer,
            'rapport_ping': RapportPINGSerializer,
            'presentation': PresentationSerializer,
            'fiche_synthese': FicheSyntheseSerializer
        }.get(document_type)
    

class AddUserView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    
class CreerJournauxFormation(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = JournalDeFormationCreationSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Journaux de formation créés et associés avec succès"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    

class GroupesAutoCompletionView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        search_term = request.query_params.get('search', '')
        if search_term:
            groupes = Groupe.objects.filter(nom_groupe__icontains=search_term)[:10]  
            print(groupes)  # Debug
            serializer = GroupeSerializer(groupes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)
    

class SemestresAutoCompletionView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        search_term = request.query_params.get('search', '')
        if search_term:
            semestres = Semestre.objects.filter(nom_semestre__icontains=search_term)[:10]  
            print(semestres)  # Debug
            serializer = SemestreSerializer(semestres, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)
    





