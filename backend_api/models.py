from django.db import models
from django.contrib.auth.models import User

class Vehicle(models.Model):
    VEHICLE_TYPES = [
        ('keke', 'Keke'),
        ('car', 'Car'),
        ('taxi_bus', 'Taxi Bus'),
        ('bike', 'Bike'),
    ]

    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPES)
    model = models.CharField(max_length=100)         
    color = models.CharField(max_length=50)
    driver_name = models.CharField(max_length=100)
    plate_number = models.CharField(max_length=20, unique=True)

class profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number=models.CharField(max_length=11, unique=True)
    bio = models.TextField(blank=True)



    def __str__(self):
        return f"{self.model} - {self.plate_number}"
# Create your models here.
