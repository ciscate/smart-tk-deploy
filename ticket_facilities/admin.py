from django.contrib import admin
from .models import TicketFacilities, TicketFacilitiesFile

# Define un Inline para gestionar los archivos asociados con TicketFacilities
class TicketFacilitiesFileInline(admin.TabularInline):
    model = TicketFacilitiesFile
    extra = 1  # Permite mostrar un campo adicional para añadir nuevos archivos
    readonly_fields = ('filename', 'extension')  # Muestra nombre y extensión de archivo en modo solo lectura
    fields = ('fileupload', 'filename', 'extension')  # Orden de campos en la vista de archivos

# Configuración del panel de administración para TicketFacilities
@admin.register(TicketFacilities)
class TicketFacilitiesAdmin(admin.ModelAdmin):
    inlines = [TicketFacilitiesFileInline]  # Incluye los archivos como parte de TicketFacilities
    list_display = ('title', 'status', 'user', 'created')  # Muestra campos clave en la lista de tickets
    list_filter = ('status', 'user')  # Añade filtros de búsqueda
    search_fields = ('title', 'description')  # Añade barra de búsqueda