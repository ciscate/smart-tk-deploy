from django.urls import path, include
from rest_framework import routers
from ticket_technical import views



router = routers.DefaultRouter()
router.register(r'ticketstechnical',views.TicketTechnicalView, 'ticketstechnical')

urlpatterns = [
    path("api/v1/",include(router.urls)),
]
