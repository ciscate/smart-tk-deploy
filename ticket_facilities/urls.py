from django.urls import path, include
from rest_framework import routers
from ticket_facilities import views



router = routers.DefaultRouter()
router.register(r'ticketsfacilities',views.TicketFacilitiesView, 'ticketsfacilities')

urlpatterns = [
    path("api/v1/",include(router.urls)),
]