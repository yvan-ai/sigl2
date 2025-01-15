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
from django.utils.decorators import method_decorator
from django.views import View
from django.contrib.auth.decorators import login_required
######################################################
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
import logging

class IsApprenti:
    """Permission pour vérifier si l'utilisateur est un apprenti."""
    def has_permission(self, request, view):
        return request.user.user_type == 2


def send_notification(subject, message, recipient_email):
    """
    Envoie une notification par email.
    """
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [recipient_email],
        fail_silently=False,
    )


logger = logging.getLogger(__name__)

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
                return Response({'error': 'Le paramètre email est requis'}, status=status.HTTP_400_BAD_REQUEST)

            encadrant = get_object_or_404(Utilisateur, email=email)
            
            if encadrant.user_type == 5:  # Maître d'apprentissage
                maitre = get_object_or_404(MaitreApprentissage, user=encadrant)
                apprentis = Apprenti.objects.filter(maitre_apprentissage=maitre)
            elif encadrant.user_type == 3:  # Tuteur pédagogique
                tuteur = get_object_or_404(TuteurPedagogique, user=encadrant)
                apprentis = Apprenti.objects.filter(tuteur_pedagogique=tuteur)
            else:
                return Response({'error': 'Type d\'utilisateur non autorisé'}, status=status.HTTP_403_FORBIDDEN)
            
            serializer = ApprentiBriefSerializer(apprentis, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': f'Erreur lors de la récupération des apprentis: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def journal(self, request, pk=None):
        """
        Récupère le journal de formation d'un apprenti
        """
        try:
            email = request.query_params.get('email')
            
            if not email:
                return Response({'error': 'Le paramètre email est requis'}, status=status.HTTP_400_BAD_REQUEST)

            encadrant = get_object_or_404(Utilisateur, email=email)
            
            if encadrant.user_type == 5:  # Maître d'apprentissage
                maitre = get_object_or_404(MaitreApprentissage, user=encadrant)
                apprenti = get_object_or_404(Apprenti, id=pk, maitre_apprentissage=maitre)
            elif encadrant.user_type == 3:  # Tuteur pédagogique
                tuteur = get_object_or_404(TuteurPedagogique, user=encadrant)
                apprenti = get_object_or_404(Apprenti, id=pk, tuteur_pedagogique=tuteur)
            else:
                return Response({'error': 'Type d\'utilisateur non autorisé'}, status=status.HTTP_403_FORBIDDEN)
            
            if not apprenti.numero_journal:
                return Response({'error': 'Aucun journal trouvé pour cet apprenti'}, status=status.HTTP_404_NOT_FOUND)
                
            serializer = JournalFormationSerializer(apprenti.numero_journal)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': f'Erreur lors de la récupération du journal: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    
class DocumentEditViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def update_document(self, request, pk=None):
        try:
            document_type = request.data.get('document_type')
            comment = request.data.get('comment')

            logger.info(f"Received update_document request: document_type={document_type}, comment={comment}")

            if not document_type:
                return Response({'error': 'Le paramètre document_type est requis'}, status=status.HTTP_400_BAD_REQUEST)

            encadrant = request.user
            apprenti = get_object_or_404(Apprenti, id=pk)

            if not self._has_permission(encadrant, apprenti):
                return Response({'error': 'Accès interdit'}, status=status.HTTP_403_FORBIDDEN)

            document_model = self._get_document_model(document_type)
            if not document_model:
                return Response({'error': f'Type de document inconnu: {document_type}'}, status=status.HTTP_400_BAD_REQUEST)

            document = get_object_or_404(document_model, numero=apprenti.numero_journal)
            
            document.commentaire = comment
            document.save()

            serializer_class = self._get_serializer_class(document_type)
            if not serializer_class:
                return Response({'error': f'Serializer non trouvé pour le type: {document_type}'}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = serializer_class(document)
            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error in update_document: {str(e)}")
            return Response({'error': f'Erreur lors de l\'édition du document: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    def _has_permission(self, encadrant, apprenti):
        logger.info(f"Checking permission: Encadrant type={encadrant.user_type}, "
                    f"Apprenti maitre_apprentissage={apprenti.maitre_apprentissage_id}, "
                    f"Apprenti tuteur_pedagogique={apprenti.tuteur_pedagogique_id}")
        return encadrant.user_type in [3, 5]  # Tuteur pédagogique ou Maître d'apprentissage

    def _get_document_model(self, document_type):
        document_types = {
            'RapportFinal': RapportFinal,
            'RapportPING': RapportPING,
            'Presentation': Presentation,
            'FicheSynthese': FicheSynthese
        }
        return document_types.get(document_type)

    def _get_serializer_class(self, document_type):
        serializer_classes = {
            'RapportFinal': RapportFinalSerializer,
            'RapportPING': RapportPINGSerializer,
            'Presentation': PresentationSerializer,
            'FicheSynthese': FicheSyntheseSerializer
        }
        return serializer_classes.get(document_type)

    

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
    

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        data = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "is_responsable_cursus":user.is_responsable_cursus,
            "is_superuser":user.is_superuser,
            "is_staff":user.is_staff,
            "user_type": user.get_user_type_display(),  # Retourne la valeur descriptive du type d'utilisateur
        }
        return JsonResponse(data)



###########################
class DocumentListView(APIView):
    def get(self, request, type, format=None):
        # Récupère l'id du journal de formation de l'apprenti connecté
        apprenti = request.user.apprenti_profile
        
        # Récupère les documents associés à ce journal
        documents = []
        if type == 'rapport_final':
            documents = RapportFinal.objects.filter(journaldeformation__apprenti=apprenti)
        elif type == 'rapport_ping':
            documents = RapportPING.objects.filter(journaldeformation__apprenti=apprenti)
        elif type == 'presentation':
            documents = Presentation.objects.filter(journaldeformation__apprenti=apprenti)
        elif type == 'synthese':
            documents = FicheSynthese.objects.filter(journaldeformation__apprenti=apprenti)

        # Sérialisation des documents
        if type == 'rapport_final':
            serializer = RapportFinalSerializer(documents, many=True)
        elif type == 'rapport_ping':
            serializer = RapportPINGSerializer(documents, many=True)
        elif type == 'presentation':
            serializer = PresentationSerializer(documents, many=True)
        elif type == 'synthese':
            serializer = FicheSyntheseSerializer(documents, many=True)

        return Response(serializer.data)

class DocumentNoteView(APIView):
    def post(self, request, document_id, format=None):
        # Récupère le document et met à jour la note et les commentaires
        
        commentaires = request.data.get('commentaires')
        
        # Trouver le document spécifique (à adapter selon le type)
        try:
            document = RapportFinal.objects.get(id=document_id)  # Exemple pour RapportFinal
            document.commentaire = commentaires
            document.save()
            return Response({"message": "Note et commentaire ajoutés"}, status=status.HTTP_200_OK)
        except RapportFinal.DoesNotExist:
            return Response({"error": "Document non trouvé"}, status=status.HTTP_404_NOT_FOUND)



