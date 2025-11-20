from django.urls import path
from rest_framework import routers
from django.urls import path, include
from .views import VehicleViewSet, signup, login, profile_view

router = routers.DefaultRouter()
router.register(r'vehicles', VehicleViewSet, basename='vehicle')

urlpatterns = [
    path('backend/', include(router.urls)),
    path("signup/", signup, name="signup"),
    path("login/", login, name="login"),
    path("profile/", profile_view, name="profile"),
]