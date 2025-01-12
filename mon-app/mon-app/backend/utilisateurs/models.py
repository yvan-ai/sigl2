from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, user_type=2, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('user_type', user_type)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', 1)
        return self.create_user(email, password, **extra_fields)

class Utilisateur(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = (
        (1, 'Admin'),
        (2, 'Apprenti'),
        (3, 'Tuteur pédagogique'),
        (4, 'Enseignant'),
        (5, 'Maitre d apprentissage'),
        (6, 'coordinatrice d apprentissage'),
        (7, 'Entreprise'),
    )
    
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_responsable_cursus = models.BooleanField(default=False)
    user_type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, default=2)

    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

class Admin(models.Model):
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='admin_profile')


class TuteurPedagogique(models.Model):
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='tuteur_pedagogique')

class Enseignant(models.Model):
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='enseignant')

class Echeance(models.Model):
    id = models.AutoField(primary_key=True)
    date_debut = models.DateField()
    date_fin = models.DateField()

class Formation(models.Model):
    intitule = models.CharField(max_length=255, primary_key=True)

class Groupe(models.Model):
    numero = models.AutoField(primary_key=True)
    nom_groupe = models.CharField(max_length=255, blank=True, null=True)
    capacite = models.IntegerField()
    formation = models.ForeignKey(Formation, on_delete=models.SET_NULL, blank=True, null=True)

class Semestre(models.Model):
    id = models.AutoField(primary_key=True)
    nom_semestre=models.CharField(max_length=255, null=False,default='current')
    date_debut = models.DateField()
    date_fin = models.DateField()
    echeance = models.ForeignKey(Echeance, on_delete=models.SET_NULL,blank=True,null=True)


class JournalDeFormation(models.Model):
    numero = models.AutoField(primary_key=True)
    groupe = models.ForeignKey(Groupe, on_delete=models.SET_NULL, blank=True, null=True)
    date_derniere_modification = models.DateField(auto_now=True)
    semestre = models.ForeignKey(Semestre, on_delete=models.SET_NULL, blank=True, null=True)

class Entreprise(models.Model):
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='entreprise')
    nom_entreprise = models.CharField(max_length=255)
    siret = models.IntegerField(null=True)
    adresse_entreprise = models.CharField(max_length=255, null=True)
    nom_responsable = models.CharField(max_length=255, null=True)
    prenom_responsable = models.CharField(max_length=255, null=True)
    mission_apprenti = models.CharField(max_length=500, null=True)
    type_contrat = models.CharField(max_length=255, null=True)
    nom_du_referent = models.CharField(max_length=255, null=True)

class CoordinatriceApprentissage(models.Model):
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='coordinatrice_apprentissage')

class MaitreApprentissage(models.Model):
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='maitre_apprentissage')
    entreprise_maitre = models.ForeignKey(Entreprise, blank=True, on_delete=models.SET_NULL, null=True)

class Apprenti(models.Model):
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='apprenti_profile')
    date_naissance = models.DateField(null=True)
    telephone = models.CharField(max_length=20, blank=True)
    tuteur_pedagogique = models.ForeignKey(TuteurPedagogique, blank=True, null=True, on_delete=models.SET_NULL)
    numero_journal = models.ForeignKey(JournalDeFormation, blank=True,null=True, on_delete=models.SET_NULL) 
    groupe = models.ForeignKey(Groupe, blank=True, null=True, on_delete=models.SET_NULL)
    maitre_apprentissage = models.ForeignKey(MaitreApprentissage, blank=True, null=True, on_delete=models.SET_NULL)
    coordinatrice_apprentissage = models.ForeignKey(CoordinatriceApprentissage, blank=True, null=True, on_delete=models.SET_NULL)
    entreprise_apprenti = models.ForeignKey(Entreprise, blank=True, on_delete=models.SET_NULL, null=True)


class RapportFinal(models.Model):
    numero = models.OneToOneField(JournalDeFormation, primary_key=True, on_delete=models.CASCADE)
    document = models.FileField(upload_to='rapportFinal_doc/',null=True,blank=True)
    commentaire = models.TextField(blank=True)
    date_publication = models.DateField(auto_now=True)

class RapportPING(models.Model):
    numero = models.OneToOneField(JournalDeFormation, primary_key=True, on_delete=models.CASCADE)
    document = models.FileField(upload_to='ping_doc/',null=True,blank=True)
    commentaire = models.TextField(blank=True)
    date_publication = models.DateField(auto_now=True)

class Presentation(models.Model):
    numero = models.OneToOneField(JournalDeFormation, primary_key=True, on_delete=models.CASCADE)
    document = models.FileField(upload_to='presentation_doc/',null=True,blank=True)
    commentaire = models.TextField(blank=True)
    date_publication = models.DateField(auto_now=True)

class FicheSynthese(models.Model):
    numero = models.OneToOneField(JournalDeFormation, primary_key=True, on_delete=models.CASCADE)
    document = models.FileField(upload_to='ficheSyn_doc/',null=True,blank=True)
    commentaire = models.TextField(blank=True)
    date_publication = models.DateField(auto_now=True)

class Evaluation(models.Model):
    id = models.AutoField(primary_key=True)
    note = models.FloatField(blank=True, null=True)
    idEcheance = models.ForeignKey(Echeance, on_delete=models.SET_NULL,null=True, blank=True)
    idApprenti = models.ForeignKey(Apprenti, on_delete=models.SET_NULL,blank=True, null=True)

class Soutenance(models.Model):
    id = models.AutoField(primary_key=True)
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE)
    semestre = models.IntegerField()
    note = models.FloatField()
    commentaire = models.TextField()

# Jury
class Jury(models.Model):
    id = models.AutoField(primary_key=True)
    enseignant = models.ForeignKey(Enseignant, on_delete=models.CASCADE)

class EntretienSemestriel(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    semestre = models.IntegerField()
    note = models.FloatField()
    commentaire = models.TextField()
    maitre_apprentissage = models.ForeignKey(MaitreApprentissage, on_delete=models.CASCADE)
    tuteur_pedagogique = models.ForeignKey(TuteurPedagogique, on_delete=models.CASCADE)
    apprenti = models.ForeignKey(Apprenti, on_delete=models.CASCADE)

# Formulaire
class Formulaire(models.Model):
    note = models.FloatField()
    entretien = models.ForeignKey(EntretienSemestriel, on_delete=models.CASCADE)


# Membre Jury
class MembreJury(models.Model):
    membre1 = models.ForeignKey(Jury, related_name='membre1', on_delete=models.CASCADE)
    membre2 = models.ForeignKey(Jury, related_name='membre2', on_delete=models.CASCADE)
    jury = models.ForeignKey(Jury, related_name='jury', on_delete=models.CASCADE)

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    heure = models.TimeField()
    adresse = models.CharField(max_length=100, null=True, blank=True)
    intitulé = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(max_length=10000, null=True, blank=True)
    image = models.ImageField(upload_to="event_image/", null=True, blank=True)
    
    def __str__(self):
        return self.intitulé or "Event"
    
class Notification(models.Model):
    user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)  # L'utilisateur concerné
    message = models.CharField(max_length=1000)  # Le contenu de la notification
    created_at = models.DateTimeField(auto_now_add=True)  # Date de création
    read = models.BooleanField(default=False)  # Statut de lecture
    type = models.CharField(max_length=50, default='general')  # Type de notification, ex: 'alert', 'message', 'reminder'
    scheduled_date = models.DateField(null=True, blank=True)  # Date de rappel
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True)  # Événement associé
    reminder = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification pour {self.user.username} - {self.message[:20]}..."

@receiver(post_save, sender=Utilisateur)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.user_type == 1:
            Admin.objects.create(user=instance)
        elif instance.user_type == 2:
            Apprenti.objects.create(user=instance)
        elif instance.user_type == 3:
            TuteurPedagogique.objects.create(user=instance)
        elif instance.user_type == 4:
            Enseignant.objects.create(user=instance)
        elif instance.user_type == 5:
            MaitreApprentissage.objects.create(user=instance)
        elif instance.user_type == 6:
            CoordinatriceApprentissage.objects.create(user=instance)
        elif instance.user_type == 7:
            Entreprise.objects.create(user=instance)