from django.urls import path, include
from rest_framework import routers
from ticket_voucher import views



router = routers.DefaultRouter()
router.register(r'ticketsvoucher',views.TicketVoucherView, 'ticketsvoucher')

urlpatterns = [
    path("api/v1/",include(router.urls)),
]
