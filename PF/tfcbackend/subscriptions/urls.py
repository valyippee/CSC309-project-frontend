from django.urls import path
from subscriptions.views import SubscriptionView, user_subscribe, cancel_subscription, UserSubscriptionView
from django.views.decorators.csrf import csrf_exempt

app_name = 'accounts'

urlpatterns = [
    path('', csrf_exempt((SubscriptionView.as_view())), name='create_or_list'),
    path('<int:subscription_id>/subscribe/', user_subscribe, name='subscribe'),
    path('cancel/', cancel_subscription, name='cancel_subscription'),
    path('mysubscription/', UserSubscriptionView.as_view(), name='my-subscription')
]
