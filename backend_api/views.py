from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status, viewsets
from .models import Vehicle, Route, profile
from .serializer import VehicleSerializer, RouteSerializer, ProfileSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


class VehicleViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Vehicle instances.
    Supports full route management.
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def add_route(self, request, pk=None):
        """Add a route to a vehicle"""
        vehicle = self.get_object()
        
        try:
            data = request.data
            # Get next order number
            next_order = vehicle.routes.count()
            
            route = Route.objects.create(
                vehicle=vehicle,
                origin=data.get('origin'),
                destination=data.get('destination'),
                distance_km=data.get('distance_km', 0.0),
                estimated_time_minutes=data.get('estimated_time_minutes', 15),
                order=next_order
            )
            
            serializer = RouteSerializer(route)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def advance_route(self, request, pk=None):
        """Move shuttle to next route"""
        vehicle = self.get_object()
        total_routes = vehicle.routes.count()
        
        if vehicle.current_route_index < total_routes:
            # Mark current route as completed
            current_route = vehicle.routes.all().order_by('order')[vehicle.current_route_index]
            current_route.is_completed = True
            current_route.save()
            
            # Move to next route
            vehicle.current_route_index += 1
            vehicle.save()
            
            # Check if all routes completed
            if vehicle.current_route_index >= total_routes:
                return Response({
                    'message': 'All routes completed',
                    'vehicle': VehicleSerializer(vehicle).data
                }, status=status.HTTP_200_OK)
            
            return Response({
                'message': 'Advanced to next route',
                'vehicle': VehicleSerializer(vehicle).data
            }, status=status.HTTP_200_OK)
        
        return Response({'error': 'No more routes'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def routes(self, request, pk=None):
        """Get all routes for a vehicle"""
        vehicle = self.get_object()
        routes = vehicle.routes.all().order_by('order')
        serializer = RouteSerializer(routes, many=True)
        return Response(serializer.data)


class userViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing User instances.
    """
    queryset = User.objects.all()
    serializer_class = ProfileSerializer

# SIGNUP
@api_view(["POST"])
def signup(request):
    try:
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        phone_number = request.data.get("phone_number", "")
        
        # Validate required fields
        if not username or not password or not email:
            return Response(
                {"error": "username, password, and email are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already taken"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=username
        )

        # Create profile
        user_profile = profile.objects.create(
            user=user,
            phone_number=phone_number,
            bio=""
        )

        return Response(
            {
                "message": "User created successfully",
                "user_id": user.id,
                "username": user.username,
                "email": user.email
            },
            status=status.HTTP_201_CREATED
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# LOGIN → returns JWT token
@api_view(["POST"])
def login(request):
    try:
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_id": user.id,
                "username": user.username,
                "email": user.email
            },
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    try:
        user = request.user
        user_profile = profile.objects.get(user=user)
        serializer = ProfileSerializer(user_profile)
        return Response(serializer.data)
    except profile.DoesNotExist:
        return Response(
            {"error": "Profile not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )