from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
       # Route pour récupérer la liste des apprentis d'un maître d'apprentissage
    path('apprentis/', 
         EncadrantViewSet.as_view({'get': 'get_apprentices'}),
         name='apprentis-list'),
    
    # Route pour récupérer le journal d'un apprenti spécifique
    path('apprentis/<int:pk>/journal/', 
         EncadrantViewSet.as_view({'get': 'journal'}),
         name='apprenti-journal'),
    # Route pour mettre à jour le commentaire d'un document
    path('apprentis/<int:pk>/document/', 
         DocumentEditViewSet.as_view({'patch': 'update_document'}),
         name='update-document'),

    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('add-user/', AddUserView.as_view(), name='add_user'),
    path('journaux/creer/', CreerJournauxFormation.as_view(), name='creer_journaux_formation'),
    path('GroupesAutoCompletionView/', GroupesAutoCompletionView.as_view(), name='search-groupe'),
    path('SemestresAutoCompletionView/', SemestresAutoCompletionView.as_view(), name='search-semestre'),
    path('authPage/', authPage, name='authPage'),
         ]