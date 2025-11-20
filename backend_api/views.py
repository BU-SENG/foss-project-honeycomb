from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from .models import Vehicle, profile
from .serializer import VehicleSerializer, ProfileSerializer
from rest_framework import viewsets
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
class VehicleViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Vehicle instances.
    """
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class userViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing User instances.
    """
    queryset = User.objects.all()
    serializer_class = ProfileSerializer

# SIGNUP
@api_view(["POST"])
def signup(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")
    

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    profile.objects.create(user=user, phone=request.data.get("phone_number"), bio=request.data.get("bio", ""))
    return Response({"message": "User created successfully"})
    

# LOGIN → returns JWT token
@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=400)

    refresh = RefreshToken.for_user(user)
    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token)
    })
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    user_profile = profile.objects.get(user=user)
    serializer = ProfileSerializer(user_profile)
    return Response(serializer.data)