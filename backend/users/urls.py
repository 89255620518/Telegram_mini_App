from django.urls import include, path
from djoser.views import TokenCreateView

from .views import (TokenCreateByPhoneView, payment, send_banquet, send_hookah,
                    send_order, send_preorder, send_taxi)

urlpatterns = [
    path('', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('auth/token-email/',
            TokenCreateView.as_view(),
            name='token_email'
        ),
    path(
        'auth/token-phone/',
        TokenCreateByPhoneView.as_view(),
        name='token_phone'
    ),
    path('send-order/', send_order, name='send_order'),
    path('send-preorder/', send_preorder, name='send_preorder'),
    path('send-banquet/', send_banquet, name='send_banquet'),
    path('send-hookah/', send_hookah, name='send_hookah'),
    path('payment/', payment, name='payment'),
    path('send-taxi/', send_taxi, name='send_taxi'),
]
