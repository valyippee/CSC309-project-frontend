from django.conf import settings
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
import stripe
from datetime import datetime
from django.core.validators import validate_email
from .models import User, StripeCustomerInfo, Payment


class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(),
                                    message="User with this email already exists.")]
    )

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'password']

    def validate(self, attrs):
        if len(attrs['password']) < 8:
            raise serializers.ValidationError(
                {"password": "Password must be at least 8 characters."})
        return attrs

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()

        # sync with Stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        customer = stripe.Customer.create(email=validated_data['email'])
        StripeCustomerInfo.objects.create(user_id=user.id, stripe_customer_id=customer['id'])
        return user


class CardSerializer(serializers.Serializer):
    number = serializers.CharField(max_length=16)
    exp_month = serializers.IntegerField(max_value=12, min_value=1)
    exp_year = serializers.IntegerField()
    cvc = serializers.CharField()

    def validate(self, attrs):
        if len(attrs['number']) != 16:
            raise serializers.ValidationError(
                {"number": "Card number must be 16 digits"}
            )
        if not (len(attrs['cvc']) == 3 or len(attrs['cvc']) == 4):
            raise serializers.ValidationError(
                {"cvc": "CVC must be 3 or 4 digits"}
            )
        curr_year, curr_month = datetime.now().year, datetime.now().month
        if curr_year > attrs['exp_year'] or \
                (curr_year == attrs['exp_year'] and curr_month > attrs['exp_month']):
            raise serializers.ValidationError(
                {"exp_year": "The card has expired and is not valid"}
            )
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'avatar', 'phone_number']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['datetime', 'amount', 'last4', 'exp_month', 'exp_year']
