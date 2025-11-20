from django.db import models
from django.contrib.auth.models import User

class Vehicle(models.Model):
    VEHICLE_TYPES = [
        ('keke', 'Keke'),
        ('car', 'Car'),
        ('taxi_bus', 'Taxi Bus'),
        ('bus', 'Bus'),
        ('bike', 'Bike'),
    ]

    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPES)
    model = models.CharField(max_length=100)         
    color = models.CharField(max_length=50)
    driver_name = models.CharField(max_length=100)
    plate_number = models.CharField(max_length=20, unique=True)
    current_route_index = models.IntegerField(default=0)  # Track which route the shuttle is on
    status = models.BooleanField(default=True)  # Active/Inactive status
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.model} - {self.plate_number}"

    def get_next_route(self):
        """Get the next route the shuttle should head to"""
        routes = self.routes.all().order_by('order')
        if routes.exists() and self.current_route_index < len(routes):
            return routes[self.current_route_index]
        return None


class Route(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='routes')
    origin = models.CharField(max_length=100)  # Point A
    destination = models.CharField(max_length=100)  # Point B/C/etc
    distance_km = models.FloatField(default=0.0)  # Distance in kilometers
    estimated_time_minutes = models.IntegerField(default=15)  # Estimated travel time
    order = models.IntegerField(default=0)  # Order in the route sequence
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']
        unique_together = ['vehicle', 'order']

    def __str__(self):
        return f"{self.origin} → {self.destination} ({self.distance_km}km, ~{self.estimated_time_minutes}min)"


class profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=11, unique=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Profile for {self.user.username}"

# Create your models here.
