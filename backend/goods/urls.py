from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import FavoriteView, GoodsViewSet, ReservationViewSet

router = DefaultRouter()
router.register('goods', GoodsViewSet, basename='goods')
router.register(
    'reservations',
    ReservationViewSet,
    basename='reservations'
)

urlpatterns = [
    path('', include(router.urls)),
    path('goods/<int:favorite_id>/favorite/', FavoriteView.as_view()),
]
