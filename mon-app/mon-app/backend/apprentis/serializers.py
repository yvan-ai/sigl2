
from rest_framework import serializers
from utilisateurs.models import FicheSynthese, RapportFinal, RapportPING, Presentation

class FicheSyntheseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FicheSynthese
        fields = ['document', 'commentaire']

class PingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RapportPING
        fields = ['document', 'commentaire']

class RapportFinalSerializer(serializers.ModelSerializer):
    class Meta:
        model = RapportFinal
        fields = ['document', 'commentaire']

class PresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presentation
        fields = ['document', 'commentaire']
