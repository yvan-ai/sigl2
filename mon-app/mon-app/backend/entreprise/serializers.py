from rest_framework import serializers
from utilisateurs.models import Entreprise

class EntrepriseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entreprise
        fields = ['siret','mission_apprenti','type_contrat','nom_du_referent']

    def update(self, instance, validated_data):
        instance.siret= validated_data.get('siret', instance.siret)
        instance.mission_apprenti = validated_data.get('mission_apprenti',instance.mission_apprenti)
        instance.type_contrat= validated_data.get('type_contrat', instance.type_contrat)
        instance.nom_du_referent= validated_data.get('nom_du_referent', instance.nom_du_referent)
        instance.save()
        return instance
    