from django.urls import path, include
from rest_framework import routers
from users import views
from .views import RegisterView, ObtainAuthToken

router = routers.DefaultRouter()
router.register(r'users',views.UserView,'users')

urlpatterns = [
    path("api/v1/",include(router.urls)),
    path('api/v1/register/', RegisterView.as_view(), name='register'),  # Registro
    path('api/v1/login/', ObtainAuthToken.as_view(), name='login'),  # Login
]

urlpatterns += router.urls
