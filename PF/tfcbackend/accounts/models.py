from datetime import datetime
from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import AbstractUser
from subscriptions.models import Subscription
from .managers import UserManager

class User(AbstractUser):
    first_name = models.CharField(max_length=150, blank=False, null=False)
    last_name = models.CharField(max_length=150, blank=False, null=False)
    email = models.EmailField(blank=False, null=False, unique=True)
    avatar = models.ImageField(upload_to="user_avatars/", null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True)
    paid_until = models.DateField(null=True)
    username = None

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return "[USER] {} {}, Email: {}".format(self.first_name, self.last_name, self.email)


class StripeCustomerInfo(models.Model):
    stripe_customer_id = models.CharField(max_length=150, null=False)
    stripe_payment_method_id = models.CharField(max_length=150, null=True)

    # this has a value only if the user has a subscription:
    stripe_subscription_id = models.CharField(max_length=150, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)


def validate_month(value):
    if not 1 <= value <= 12:
        raise ValidationError("Not a valid month")


class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    datetime = models.DateTimeField(default=datetime.now)
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    last4 = models.CharField(max_length=4)
    exp_month = models.IntegerField(validators=[validate_month])
    exp_year = models.IntegerField()
