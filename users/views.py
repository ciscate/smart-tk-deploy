from rest_framework.response import Response
from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.utils import timezone
from django.conf import settings
from .models import User
from .serializer import UserSerializer, RegisterSerializer

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # Nuevo endpoint para obtener usuarios con rol de staff
    @action(detail=False, methods=['get'])
    def staff_users(self, request):
        staff_users = User.objects.filter(is_staff=True)
        serializer = self.get_serializer(staff_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

class ObtainAuthToken(APIView):
    permission_classes = [AllowAny]  # Permitir acceso sin autenticación para obtener el token

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)

            # Verificar el tiempo de expiración
            if not created:
                token_age = timezone.now() - token.created
                if token_age > settings.TOKEN_EXPIRATION_TIME:
                    # Elimina el token expirado y genera uno nuevo
                    token.delete()
                    token = Token.objects.create(user=user)
            
            return Response({
                'token': token.key, 
                'user_id': user.id, 
                'username': user.username,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
            }, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
