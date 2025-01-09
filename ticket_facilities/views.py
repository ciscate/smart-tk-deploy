from rest_framework import viewsets, status
from django.forms import ValidationError
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
import logging
import json
from django.contrib.auth import get_user_model
from .serializer import TicketFacilitiesSerializer
from .models import TicketFacilities, TicketFacilitiesFile

logger = logging.getLogger(__name__)
User = get_user_model()  # Obtenemos el modelo de usuario

class TicketFacilitiesView(viewsets.ModelViewSet):
    serializer_class = TicketFacilitiesSerializer
    queryset = TicketFacilities.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        # Extraer client_data del request
        client_data = self.request.data.get("client_data", None)

        if client_data:
            try:
                # Decodifica el JSON de client_data
                client_data_json = json.loads(client_data)

                # Transformar el JSON: usar 'razon_social' como clave
                transformed_client_data = {
                    cliente["razon_social"]: {
                        "razon_social": cliente["razon_social"],
                        **cliente
                    }
                    for cliente in client_data_json
                }

                # Guarda el ticket con el client_data transformado
                ticket = serializer.save(user=self.request.user, client_data=transformed_client_data)

            except json.JSONDecodeError:
                logger.error("Error decodificando client_data. Se enviará como None.")
                raise ValidationError({"client_data": "Formato JSON inválido"})
        else:
            # Guarda el ticket sin client_data
            ticket = serializer.save(user=self.request.user)

        # Procesa archivos desde `file_uploads`
        files = self.request.FILES.getlist('file_uploads')
        logger.info(f"Archivos recibidos para crear el ticket: {len(files)}")

        for file in files:
            TicketFacilitiesFile.objects.create(ticket=ticket, fileupload=file)

        logger.info(f"Ticket creado con ID {ticket.id} y cliente: {ticket.client_data}")



    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Verifica si `client_data` viene en la solicitud
        client_data = request.data.get("client_data", None)
        if client_data:
            try:
                instance.client_data = json.loads(client_data)  # Actualiza el JSON completo
            except json.JSONDecodeError:
                return Response(
                    {"detail": "Invalid JSON format for client_data"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Procesa otros campos y archivos
        new_status = request.data.get("status", instance.status)
        if new_status not in dict(TicketFacilities.STATUS_OPTIONS):
            return Response(
                {"detail": "Invalid status choice", "status": new_status},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Procesa el campo `assigned_to` si está presente en la solicitud
        assigned_to_data = request.data.get("assigned_to", None)
        if assigned_to_data:
            try:
                assigned_to_obj = json.loads(assigned_to_data)
                assigned_user_id = assigned_to_obj.get("id")
                assigned_user = User.objects.get(id=assigned_user_id)
                instance.assigned_to = assigned_user
            except (json.JSONDecodeError, User.DoesNotExist) as e:
                return Response(
                    {"detail": "Invalid assigned_to data or user not found", "error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Actualiza otros campos y archivos
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        files = request.FILES.getlist('file_uploads')
        for file in files:
            TicketFacilitiesFile.objects.create(ticket=instance, fileupload=file)

        instance.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


        # Actualiza el campo description si está presente en la solicitud
        new_description = request.data.get("description", instance.description)
        instance.description = new_description

        # Valida y actualiza el ticket
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Añade archivos adicionales si están presentes
        files = request.FILES.getlist('file_uploads')
        logger.info(f"Archivos adicionales para el ticket: {len(files)}")

        for file in files:
            TicketFacilitiesFile.objects.create(ticket=instance, fileupload=file)

        # Guarda cambios en el ticket
        instance.save()

        return Response(serializer.data, status=status.HTTP_200_OK)



    # Nuevo endpoint para obtener solo los tickets del usuario autenticado
    @action(detail=False, methods=['get'])
    def user_tickets(self, request):
        # Filtra los tickets que pertenecen al usuario autenticado
        user_tickets = TicketFacilities.objects.filter(user=request.user)
        serializer = self.get_serializer(user_tickets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    # Endpoint para listar las tareas asignadas al usuario staff autenticado
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def assigned_tasks(self, request):
        """
        Devuelve todas las tareas asignadas al usuario staff autenticado.
        """
        user = request.user

        # Verificar que el usuario es staff
        if not user.is_staff:
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        # Filtrar las tareas asignadas a este usuario
        tasks = TicketFacilities.objects.filter(assigned_to=user)

        serializer = TicketFacilitiesSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # Acción para actualizar el estado del ticket
    @action(detail=True, methods=['put'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        ticket = self.get_object()  # Obtener el ticket por su ID
        new_status = request.data.get('status')

        # Verificar que el nuevo estado es válido
        if new_status not in dict(TicketVoucher.STATUS_OPTIONS):
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        ticket.status = new_status
        ticket.save()

        # Serializar y devolver el ticket actualizado
        serializer = TicketVoucherSerializer(ticket)
        return Response(serializer.data, status=status.HTTP_200_OK)
