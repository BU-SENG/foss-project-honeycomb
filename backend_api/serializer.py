from rest_framework import serializers
from .models import Vehicle, Route, profile

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['id', 'origin', 'destination', 'distance_km', 'estimated_time_minutes', 'order', 'is_completed']

class VehicleSerializer(serializers.ModelSerializer):
    routes = RouteSerializer(many=True, read_only=True)
    next_route = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = ['id', 'vehicle_type', 'model', 'color', 'driver_name', 'plate_number', 
                  'current_route_index', 'status', 'routes', 'next_route', 'created_at', 'updated_at']

    def get_next_route(self, obj):
        """Get the next route the shuttle should head to"""
        next_route = obj.get_next_route()
        if next_route:
            return RouteSerializer(next_route).data
        return None

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = profile
        fields = '__all__'
