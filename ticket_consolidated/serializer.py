from rest_framework import serializers
from .models import TicketConsolidated, TicketConsolidatedFile
from django.contrib.auth import get_user_model

User = get_user_model()  # Importa el modelo de usuario actual


class TicketFileSerializer(serializers.ModelSerializer):
    filename = serializers.CharField(source='get_filename', read_only=True)  # Nombre del archivo
    extension = serializers.CharField(source='get_extension', read_only=True)  # Extensión del archivo

    class Meta:
        model = TicketConsolidatedFile
        fields = ['id', 'fileupload', 'filename', 'extension']  # Incluye filename y extension

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'surname']  # Campos que desees incluir


class TicketConsolidatedSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)  # Para mostrar el usuario de solo lectura en respuesta
    files = TicketFileSerializer(many=True, read_only=True)  # Muestra archivos relacionados con nombre y extensión
    file_uploads = serializers.ListField(child=serializers.FileField(), write_only=True, required=False)  # Campo temporal para cargar archivos
    assigned_to = UserSerializer(read_only=True, allow_null=True)  # Cambia aquí para usar UserSerializer
    observation = serializers.CharField(allow_blank=True, required=False)
    
    client_data = serializers.JSONField(required=False)  # Añadir campo JSON para los datos del cliente

    
    class Meta:
        model = TicketConsolidated
        fields = '__all__'
        read_only_fields = ['user','assigned_to']  # Establece 'user' como campo de solo lectura para evitar conflictos

    def get_user(self, obj):
        if obj.user:
            return {
                "id": obj.user.id,
                "username": obj.user.username,
                "name": obj.user.name,
                "surname": obj.user.surname,
                "department": obj.user.department
            }
        return None

    def create(self, validated_data):
        files = validated_data.pop('file_uploads', [])
        client_data = validated_data.pop('client_data', None)  # Obtener client_data si se envía

        # Crear el ticket con los datos validados
        ticket = TicketConsolidated.objects.create(**validated_data)
        if client_data:
            ticket.client_data = client_data
            ticket.save()

        # Asociar archivos con el ticket
        for file in files:
            TicketConsolidatedFile.objects.create(ticket=ticket, fileupload=file)
        return ticket

    def update(self, instance, validated_data):
        files = validated_data.pop('file_uploads', [])
        client_data = validated_data.pop('client_data', None)  # Obtener client_data si se envía

        # Actualizar los datos del ticket
        instance = super().update(instance, validated_data)
        if client_data:
            instance.client_data = client_data
            instance.save()

        # Añadir nuevos archivos
        for file in files:
            TicketConsolidatedFile.objects.create(ticket=instance, fileupload=file)
        return instance
