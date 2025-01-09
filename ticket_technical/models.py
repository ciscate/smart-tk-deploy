from django.conf import settings
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from mimetypes import guess_type
import os

# Validador para limitar los tipos de archivo permitidos
def validate_file_extension(file):
    if not file or file.size == 0:
        raise ValidationError('El archivo no puede estar vacío.')

    allowed_mime_types = [
        'application/pdf',           
        'text/plain',                
        'text/csv',                  
        'application/vnd.ms-excel',  
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  
    ]

    file_mime_type = file.content_type if hasattr(file, 'content_type') else guess_type(file.name)[0]
    
    if file_mime_type not in allowed_mime_types:
        raise ValidationError('Tipo de archivo no permitido. Solo se permiten archivos PDF, TXT, CSV y Excel.')

class TicketTechnical(models.Model):
    STATUS_OPTIONS = [
        ('Enviado', 'Enviado'),
        ('Leido', 'Leido'),
        ('En Proceso', 'En Proceso'),
        ('Finalizado', 'Finalizado'),
    ]
    
    status = models.CharField(max_length=40, choices=STATUS_OPTIONS, default='Enviado')
    created = models.DateField(auto_now_add=True, null=True)
    datecompleted = models.DateField(null=True, blank=True)
    delivery_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    title = models.CharField(max_length=100, default='No title')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, related_name='assigned_technical_staff', on_delete=models.SET_NULL)
    observation = models.TextField(blank=True, null=True)  # Nuevo campo de observación
    custom_id = models.CharField(max_length=50, unique=True, editable=False, null=True, blank=True)  # ID compuesto
    period_start = models.DateField(null=True, blank=True)  # Fecha "desde"
    period_end = models.DateField(null=True, blank=True)    # Fecha "hasta"
    # Nuevo campo para almacenar el JSON del cliente
    client_data = models.JSONField(blank=True, null=True)  


    def save(self, *args, **kwargs):
        # Generar el custom_id solo si el ticket es nuevo
        if not self.custom_id:
            self.custom_id = f"TEC-{self.pk}" if self.pk else f"TEC-TEMP-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        if not self.status:
            self.status = 'Enviado'
        if self.status == 'Finalizado' and not self.datecompleted:
            self.datecompleted = timezone.now().date()
        elif self.status != 'Finalizado':
            self.datecompleted = None
        super().save(*args, **kwargs)
        # Actualizar el custom_id con el pk si era temporal
        if self.custom_id.startswith("TEC-TEMP") and self.pk:
            self.custom_id = f"TEC-{self.pk}"
            super().save(update_fields=["custom_id"])

    def change_status(self, new_status):
        old_status = self.status
        self.status = new_status
        self.save()
        
    def clean(self):
        if self.datecompleted and self.datecompleted < self.created:
            raise ValidationError('La fecha de finalización no puede ser anterior a la fecha de creación.')
        if self.delivery_date and self.delivery_date < timezone.now().date():
            raise ValidationError('La fecha de entrega no puede ser anterior a la fecha actual.')

    def __str__(self):
        return f"ID: {self.custom_id} - {self.title} - by {self.user.username if self.user else 'Unknown User'} | Status -> {self.status}"

class TicketTechnicalFile(models.Model):
    fileupload = models.FileField(upload_to='ticketsfiles/', validators=[validate_file_extension])
    ticket = models.ForeignKey(TicketTechnical, related_name='files', on_delete=models.CASCADE)
    filename = models.CharField(max_length=255, blank=True)
    extension = models.CharField(max_length=10, blank=True)

    def save(self, *args, **kwargs):
        if self.fileupload:
            self.filename, self.extension = os.path.splitext(self.fileupload.name)
            self.extension = self.extension.lstrip('.')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"File '{self.filename}.{self.extension}' for Ticket ID {self.ticket.custom_id}"
