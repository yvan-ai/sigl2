# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from admin_custom.models import Utilisateur, MaitreApprentissage, Apprenti, TuteurPedagogique, CoordinatriceApprentissage, Enseignant,Entreprise
from django.contrib.auth.hashers import make_password


@receiver(post_save, sender=Utilisateur)
def create_specific_user(sender, instance, created, **kwargs):
    if created:
        password_hashed = make_password(instance.password)
        if instance.user_type == 7:  # Maitre d'apprentissage
            MaitreApprentissage.objects.create(
                nom_responable=instance.nom_responable,
                prenom_responsable=instance.prenom_responsable,
                email_entreprise=instance.email_entreprise,
                mdp=instance.password  # Assure-toi que le mot de passe est haché
                # L'entreprise est à gérer séparément ou par défaut
            )
