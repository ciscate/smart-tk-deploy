from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import TicketVoucher, TicketVoucherFile

# Define un Inline para gestionar los archivos asociados con TicketTechnical
class TicketVoucherFileInline(admin.TabularInline):
    model = TicketVoucherFile
    extra = 1  # Permite mostrar un campo adicional para añadir nuevos archivos
    readonly_fields = ('filename', 'extension')  # Muestra nombre y extensión de archivo en modo solo lectura
    fields = ('fileupload', 'filename', 'extension')  # Orden de campos en la vista de archivos

# Configuración del panel de administración para TicketTechnical
@admin.register(TicketVoucher)
class TicketVoucherAdmin(admin.ModelAdmin):
    inlines = [TicketVoucherFileInline]  # Incluye los archivos como parte de TicketTechnical
    list_display = ('title', 'status', 'user', 'created')  # Muestra campos clave en la lista de tickets
    list_filter = ('status', 'user')  # Añade filtros de búsqueda
    search_fields = ('title', 'description')  # Añade barra de búsqueda

