from rest_framework import serializers
from .models import *
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Appeler la méthode validate de la classe parent
        data = super().validate(attrs)
        
        # Ajouter des champs supplémentaires
        data['user_type'] = self.user.user_type  # Inclure le champ user_type depuis l'utilisateur
        data['email'] = self.user.email  # Optionnel : Ajouter d'autres informations utilisateur

        return data

class ApprentiBriefSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    status = serializers.SerializerMethodField()

    class Meta:
        model = Apprenti
        fields = ['id', 'first_name', 'last_name', 'status']

    def get_status(self, obj):
        if obj.numero_journal:
            journal = obj.numero_journal
            has_documents = any([
                hasattr(journal, 'rapportfinal'),
                hasattr(journal, 'rapportping'),
                hasattr(journal, 'presentation'),
                hasattr(journal, 'fichesynthese')
            ])
            return has_documents
        return False

class DocumentSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    
    class Meta:
        fields = ['document', 'commentaire', 'date_publication', 'type']

    def get_type(self, obj):
        return obj.__class__.__name__

class RapportFinalSerializer(DocumentSerializer):
    class Meta(DocumentSerializer.Meta):
        model = RapportFinal

class RapportPINGSerializer(DocumentSerializer):
    class Meta(DocumentSerializer.Meta):
        model = RapportPING

class PresentationSerializer(DocumentSerializer):
    class Meta(DocumentSerializer.Meta):
        model = Presentation

class FicheSyntheseSerializer(DocumentSerializer):
    class Meta(DocumentSerializer.Meta):
        model = FicheSynthese

class JournalFormationSerializer(serializers.ModelSerializer):
    documents = serializers.SerializerMethodField()

    class Meta:
        model = JournalDeFormation
        fields = ['numero', 'date_derniere_modification', 'documents']

    def get_documents(self, obj):
        documents = []
        document_types = {
            'RapportFinal': (RapportFinal, RapportFinalSerializer),
            'RapportPING': (RapportPING, RapportPINGSerializer),
            'Presentation': (Presentation, PresentationSerializer),
            'FicheSynthese': (FicheSynthese, FicheSyntheseSerializer)
        }
        for doc_type, (model, serializer) in document_types.items():
            doc = getattr(obj, doc_type.lower(), None)
            if doc:
                documents.append(serializer(doc).data)
        return documents
    

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['email', 'user_type', 'first_name', 'last_name', 'is_responsable_cursus']

    def create(self, validated_data):
        # Générer un mot de passe aléatoire
        password = get_random_string(length=8)  # Tu peux ajuster la longueur

        user = Utilisateur(
            email=validated_data['email'],
            user_type=validated_data['user_type'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_responsable_cursus=validated_data['is_responsable_cursus'],
        )
        user.set_password(password)
        user.save()

        # Envoyer l'email avec le mot de passe provisoire
        subject = "Votre mot de passe provisoire"
        message = f"Bonjour {user.first_name},\n\nVotre mot de passe provisoire est : {password}\n\nVous pourrez le changer lors de votre première connexion."
        send_mail(
            subject,
            message,
            'from@example.com',  # Remplace par ton adresse email
            [user.email],
            fail_silently=False,
        )

        return user


    
class JournalDeFormationCreationSerializer(serializers.Serializer):
    groupe_id = serializers.IntegerField()
    semestre_id = serializers.IntegerField()

    def create(self, validated_data):
        groupe_id = validated_data.get('groupe_id')
        apprentis = Apprenti.objects.filter(groupe_id=groupe_id)
        semestre_id = validated_data.get('semestre_id')

        # Création de journaux de formation et association à chaque apprenti
        for apprenti in apprentis:
            journal = JournalDeFormation.objects.create(groupe_id=groupe_id, semestre_id=semestre_id)
            
            # Associer le journal à l'apprenti
            apprenti.numero_journal = journal  # Assigner directement le journal
            apprenti.save()

        return apprentis


class GroupeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groupe
        fields = ['numero', 'nom_groupe']  # Seuls les champs nécessaires

class SemestreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semestre
        fields = ['id', 'nom_semestre']
