from django.contrib import admin
from .models import TicketConsolidated, TicketConsolidatedFile

# Define un Inline para gestionar los archivos asociados con TicketConsolidated
class TicketConsolidatedFileInline(admin.TabularInline):
    model = TicketConsolidatedFile
    extra = 1  # Permite mostrar un campo adicional para añadir nuevos archivos
    readonly_fields = ('filename', 'extension')  # Muestra nombre y extensión de archivo en modo solo lectura
    fields = ('fileupload', 'filename', 'extension')  # Orden de campos en la vista de archivos

# Configuración del panel de administración para TicketFacilities
@admin.register(TicketConsolidated)
class TicketConsolidatedAdmin(admin.ModelAdmin):
    inlines = [TicketConsolidatedFileInline]  # Incluye los archivos como parte de TicketConsolidated
    list_display = ('title', 'status', 'user', 'created')  # Muestra campos clave en la lista de tickets
    list_filter = ('status', 'user')  # Añade filtros de búsqueda
    search_fields = ('title', 'description')  # Añade barra de búsqueda