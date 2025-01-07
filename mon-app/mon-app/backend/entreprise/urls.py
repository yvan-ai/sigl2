from django.urls import path
from .views import UpdateEntrepriseView

urlpatterns = [
    path('update-entreprise/<int:entreprise_pk>/', UpdateEntrepriseView.as_view(), name='update-entreprise'),
    
    
]