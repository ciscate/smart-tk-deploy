from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('El usuario debe tener un nombre de usuario (email)')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)  # Hash de la contraseña
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    
    DEPARTMENT_CHOICES = [
        ('Sueldos', 'Sueldos'),
        ('Impuestos', 'Impuestos'),
        ('Auditoria', 'Auditoria'),
        ('Ganancias', 'Ganancias'),
        ('BPO', 'BPO'),
    ]
    
    name = models.CharField(max_length=40)
    surname = models.CharField(max_length=40)
    username = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)  # Necesario para el manejo de usuarios activos
    is_staff = models.BooleanField(default=False)  # Para permitir el acceso al admin
    is_superuser = models.BooleanField(default=False)  # Para distinguir superusuarios
    department = models.CharField(max_length=30, choices=DEPARTMENT_CHOICES, blank=True, null=True)

    USERNAME_FIELD = 'username'  # Usar username (email) como el campo de autenticación
    REQUIRED_FIELDS = ['name', 'surname']

    objects = UserManager()

    def __str__(self):
        return f'ID: {self.id} {self.name} {self.surname}'
