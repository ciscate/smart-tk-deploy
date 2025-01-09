from rest_framework import routers
from django.urls import path, include
from ticket_consolidated import views

router = routers.DefaultRouter()
router.register(r'ticketsconsolidated',views.TicketConsolidatedView, 'ticketsconsolidated')

urlpatterns = [
    path("api/v1/",include(router.urls)),
]