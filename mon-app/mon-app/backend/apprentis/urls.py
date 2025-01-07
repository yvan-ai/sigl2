from .views import *
from django.urls import path

urlpatterns = [
    path('journal/<int:journal_id>/deposer/', DeposerFichier.as_view(), name='deposer_fichier'),
    path('journal/current/', get_current_journal, name='get_current_journal'),
]