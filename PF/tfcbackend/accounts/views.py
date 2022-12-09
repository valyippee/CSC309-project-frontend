import stripe
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from .serializers import UserRegisterSerializer, CardSerializer, PaymentSerializer, ProfileSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from .models import StripeCustomerInfo, Payment, User


class RegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data.pop('password')
        return response


@api_view(['POST'])
def login_user(request):
    """Authenticates user and returns a token if successful."""
    email = request.data.get("email", "")
    password = request.data.get("password", "")
    user = authenticate(request, email=email, password=password)
    if user is not None:
        token = Token.objects.get_or_create(user=user)[0].key
        return Response({"token": token})
    return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Logs user out and deletes token auth."""
    request.user.auth_token.delete()
    return Response(status=status.HTTP_200_OK)


def auth_and_setup_stripe(request):
    """Basic setup used across all requests.
    Returns the stripe customer object in our database
    """
    stripe.api_key = settings.STRIPE_SECRET_KEY
    user_id = Token.objects.get(key=request.auth.key).user_id
    return StripeCustomerInfo.objects.get(user_id=user_id)


class CardInfo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieves the credit/debit card information of the user."""
        stripe_customer = auth_and_setup_stripe(request)
        all_cards = []
        if stripe_customer.stripe_payment_method_id:
            pm = stripe.PaymentMethod.retrieve(stripe_customer.stripe_payment_method_id)
            all_cards.append({"last4": pm["card"]["last4"],
                              "exp_month": pm["card"]["exp_month"],
                              "exp_year": pm["card"]["exp_year"]})
        return Response(all_cards)

    def put(self, request):
        """Removes the previous the credit/debit card if it exists
        and adds a new one to the user."""
        stripe_customer = auth_and_setup_stripe(request)
        try:
            # create or update payment method
            pm_id = self._create_stripe_payment_method(
                request.data, stripe_customer.stripe_customer_id, stripe_customer.stripe_payment_method_id)

            # update internal representation of stripe customer
            stripe_customer.stripe_payment_method_id = pm_id
            stripe_customer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except stripe.error.CardError:
            return Response({"detail": "Card details are invalid."}, status=status.HTTP_400_BAD_REQUEST)

    def _create_stripe_payment_method(self, data, customer_id, previous_pm_id):
        """Creates a stripe payment method and attach it to the customer
        with id <customer_id>. Returns the stripe payment method's id.
        """
        serializer = CardSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        pm = stripe.PaymentMethod.create(
            type="card",
            card={
                "number": data['number'],
                "exp_month": data['exp_month'],
                "exp_year": data['exp_year'],
                "cvc": data['cvc']
            }
        )
        # detach if exists
        if previous_pm_id:
            stripe.PaymentMethod.detach(previous_pm_id)
        # attach new payment method and set as default
        stripe.PaymentMethod.attach(
            pm["id"], customer=customer_id
        )
        stripe.Customer.modify(
            customer_id,
            invoice_settings={"default_payment_method": pm["id"]}
        )
        return pm["id"]


class ProfileView(APIView):
    """
    Endpoint: GET PATCH /api/accounts/profile
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = self.get_user(request)
        serializer = ProfileSerializer(user, context = {'request' : request})

        return Response(serializer.data)

    def patch(self, request):
        user = self.get_user(request)
        serializer = ProfileSerializer(user, data=request.data, partial=True, context = {'request' : request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response(serializer.data)

    def get_user(self, request):
        """
        Helper function for get and patch
        """
        user_id = Token.objects.get(key=request.auth.key).user_id
        user = User.objects.get(id=user_id)
        return user


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payments(request):
    user_id = Token.objects.get(key=request.auth.key).user_id
    user = User.objects.get(id=user_id)
    start_datetime = request.query_params.get("start_datetime", None)
    if start_datetime:
        # only display payments from this start datetime, with limit defined in settings
        try:
            start_datetime = datetime.strptime(start_datetime, "%Y-%m-%dT%H:%M:%S")
        except ValueError as e:
            return Response({"start_datetime": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        payments = Payment.objects.filter(
            user_id=user_id, datetime__gt=start_datetime).order_by('datetime')[:settings.PAYMENT_PAGE_LIMIT]
    else:
        # display a limited number of payments, starting from the first payment
        payments = Payment.objects.filter(user_id=user_id).order_by('datetime')[:settings.PAYMENT_PAGE_LIMIT]

    payments_history = PaymentSerializer(list(payments), many=True).data
    future_payments = []

    if user.subscription:
        amount = user.subscription.price
        if user.subscription.plan == 0:
            months = 1
        else:
            months = 12
        next_payment = datetime.combine(user.paid_until, datetime.min.time())

        # find next payment after start_datetime
        while start_datetime and next_payment <= start_datetime:
            next_payment += relativedelta(months=months)

        num_future_payments = max(0, settings.PAYMENT_PAGE_LIMIT - payments.count())
        stripe.api_key = settings.STRIPE_SECRET_KEY
        stripe_customer = StripeCustomerInfo.objects.get(user_id=user.id)
        stripe_pm = stripe.PaymentMethod.retrieve(stripe_customer.stripe_payment_method_id)
        for i in range(num_future_payments):
            payment_details = {"amount": amount,
                               "last4": stripe_pm["card"]["last4"],
                               "exp_month": stripe_pm["card"]["exp_month"],
                               "exp_year": stripe_pm["card"]["exp_year"],
                               "datetime": next_payment}
            future_payments.append(payment_details)
            next_payment += relativedelta(months=months)
    return Response({"data": {"history": payments_history, "future": future_payments}})
