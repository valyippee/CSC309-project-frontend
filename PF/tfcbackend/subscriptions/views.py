import stripe
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from .serializers import SubscriptionSerializer
from rest_framework.authtoken.models import Token
import datetime
from dateutil.relativedelta import relativedelta
from rest_framework.generics import RetrieveAPIView
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

from .models import Subscription, StripeSubscriptionInfo
from accounts.models import StripeCustomerInfo, User, Payment
from studios.models import UserClass

stripe.api_key = settings.STRIPE_SECRET_KEY


class SubscriptionView(ListAPIView):
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription(request):
    """Cancel the subscription of user. If user does not have one, the request is ignored."""
    # get user related info
    user_id = Token.objects.get(key=request.auth.key).user_id
    user = User.objects.get(id=user_id)
    stripe_customer = StripeCustomerInfo.objects.get(user_id=user_id)

    if user.subscription:
        # cancel stripe subscription
        stripe.Subscription.delete(stripe_customer.stripe_subscription_id)

        # drop classes after current billing period
        for user_class in UserClass.objects.filter(user_id=user.id, dropped=False):
            user_class.end_date = user.paid_until
            user_class.save()

        # sync with database
        user.subscription = None
        user.save()
        stripe_customer.stripe_subscription_id = None
        stripe_customer.save()
    return Response(status=status.HTTP_200_OK)


@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def user_subscribe(request, subscription_id):
    # check if subscription exists
    if not Subscription.objects.all().filter(id=subscription_id).exists():
        return Response(
            {"subscription_id": "subscription with id {} does not exist".format(subscription_id)},
            status=status.HTTP_400_BAD_REQUEST)

    # get user related info
    user_id = Token.objects.get(key=request.auth.key).user_id
    user = User.objects.get(id=user_id)
    stripe_customer = StripeCustomerInfo.objects.get(user_id=user_id)

    # if user does not have a payment method setup, reject request
    if not stripe_customer.stripe_payment_method_id:
        return Response(
            {"user": "User does not have a payment method set up"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if request.method == 'POST':
        """Subscribe the user to the subscription given by subscription_id if the user has
        a valid payment method set up."""

        # If user already has a subscription, reject request. Use PUT instead to update subscription.
        if user.subscription:
            return Response(
                {"subscription_id": "User is already subscribed to a subscription plan."},
                status=status.HTTP_400_BAD_REQUEST)

        # get subscription related info
        subscription = Subscription.objects.get(id=subscription_id)
        sub_info = StripeSubscriptionInfo.objects.get(subscription_id=subscription_id)

        # create stripe subscription
        stripe_sub = stripe.Subscription.create(
            customer=stripe_customer.stripe_customer_id,
            items=[
                {"price": sub_info.stripe_price_id}
            ]
        )
        # don't pay if the user has paid until a certain date
        if user.paid_until is None or user.paid_until <= datetime.datetime.now().date():
            # update payment history
            stripe_pm = stripe.PaymentMethod.retrieve(stripe_customer.stripe_payment_method_id)
            Payment.objects.create(user_id=user.id,
                                   amount=subscription.price,
                                   last4=stripe_pm["card"]["last4"],
                                   exp_year=stripe_pm["card"]["exp_year"],
                                   exp_month=stripe_pm["card"]["exp_month"])
            # update user paid_until field
            if subscription.plan == 0:
                months = 1
            else:
                months = 12
            paid_until = datetime.date.today() + relativedelta(months=months)
            user.paid_until = paid_until

        # all current user classes should not have an end date
        for _class in UserClass.objects.filter(user_id=user.id, dropped=False):
            if _class.end_date:
                _class.end_date = None
                _class.save()

        # update user's subscription info
        user.subscription = subscription
        user.save()
        stripe_customer.stripe_subscription_id = stripe_sub["id"]
        stripe_customer.save()

        return Response(status=status.HTTP_200_OK)
    else:
        """Subscribe the user to the subscription given by subscription_id if the user has
        a valid payment method set up. If a user has a previous subscription, the payment will occur after
        the last subscription date has ended."""

        # if user is already subscribed to this subscription, reject request
        if subscription_id == user.subscription.id:
            return Response(
                {"user": "User is already subscribed to this subscription plan."},
                status=status.HTTP_400_BAD_REQUEST
            )

        stripe_sub = stripe.Subscription.retrieve(stripe_customer.stripe_subscription_id)

        # get new subscription
        subscription = Subscription.objects.get(id=subscription_id)
        sub_info = StripeSubscriptionInfo.objects.get(subscription_id=subscription_id)

        # update user's subscription on stripe
        stripe_sub = stripe.Subscription.modify(
            stripe_customer.stripe_subscription_id,
            items=[{
                'id': stripe_sub['items']['data'][0].id,
                "price": sub_info.stripe_price_id
            }]
        )

        # update user's subscription info
        user.subscription = subscription
        user.save()
        stripe_customer.stripe_subscription_id = stripe_sub["id"]
        stripe_customer.save()

        return Response(status=status.HTTP_200_OK)


class UserSubscriptionView(RetrieveAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_object(self):
        user = self.request.user

        if user.subscription is None:
            raise ValidationError({"error_msg": "User has not subscribed to a subscription plan."})
        else:
            return get_object_or_404(Subscription, id=user.subscription.id)
