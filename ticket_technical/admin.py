from django.contrib import admin
from .models import TicketTechnical, TicketTechnicalFile

# Define un Inline para gestionar los archivos asociados con TicketTechnical
class TicketTechnicalFileInline(admin.TabularInline):
    model = TicketTechnicalFile
    extra = 1  # Permite mostrar un campo adicional para añadir nuevos archivos
    readonly_fields = ('filename', 'extension')  # Muestra nombre y extensión de archivo en modo solo lectura
    fields = ('fileupload', 'filename', 'extension')  # Orden de campos en la vista de archivos

# Configuración del panel de administración para TicketTechnical
@admin.register(TicketTechnical)
class TicketTechnicalAdmin(admin.ModelAdmin):
    inlines = [TicketTechnicalFileInline]  # Incluye los archivos como parte de TicketTechnical
    list_display = ('title', 'status', 'user', 'created')  # Muestra campos clave en la lista de tickets
    list_filter = ('status', 'user')  # Añade filtros de búsqueda
    search_fields = ('title', 'description')  # Añade barra de búsqueda

