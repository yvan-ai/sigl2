# admin_custom/serializers.py
from rest_framework import serializers
from utilisateurs.models import  Utilisateur, MaitreApprentissage, Apprenti, TuteurPedagogique, CoordinatriceApprentissage, Enseignant, Entreprise


class MaitreApprentissageSerializer(serializers.ModelSerializer):
    class Meta:                                                                                                                                   
        model = MaitreApprentissage
        fields = ['telephone','date_naissance','entreprise']

    def update(self, instance, validated_data):
        instance.telephone = validated_data.get('telephone', instance.telephone)
        instance.entreprise = validated_data.get('entreprise', instance.entreprise)
        instance.date_naissance = validated_data.get('date_naissance',instance.date_naissance)
        instance.save()
        return instance

class TutoratSerializer(serializers.ModelSerializer):
    class Meta:
        model = TuteurPedagogique
        fields = ['telephone','date_naissance']

    def update(self, instance, validated_data):
        instance.telephone = validated_data.get('telephone', instance.telephone)
        instance.date_naissance = validated_data.get('date_naissance',instance.date_naissance)
        instance.save()
        return instance
    
class ApprentiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apprenti
        fields = ['tuteur_pedagogique', 'maitre_apprentissage']
        # il y'a encore une reflexion à faire
    def update(self, instance, validated_data):
        instance.tuteur_pedagogique = validated_data.get('tuteur_pedagogique', instance.tuteur_pedagogique)
        instance.maitre_apprentissage = validated_data.get('maitre_apprentissage', instance.maitre_apprentissage)
        instance.save()
        return instance


class EntrepriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entreprise
        fields = [ 'nom_entreprise','email_entreprise','nom_responsable','prenom_responsable','mdp']

    def create(self, validated_data):
        # Hash the password before saving the user
        user = Entreprise(
            email_entreprise=validated_data['email_entreprise'],
            prenom_responsable=validated_data['prenom_responsable'],
            nom_responsable=validated_data['nom_responsable'],
            


        )
        
        user.save()
        return user