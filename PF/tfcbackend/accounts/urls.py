from django.urls import path
from accounts.views import RegisterView, login_user, logout_user, CardInfo, get_payments, ProfileView

app_name = 'accounts'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('cardinfo/', CardInfo.as_view(), name='add_card'),
    path('paymenthistory/', get_payments, name='payment_history'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
