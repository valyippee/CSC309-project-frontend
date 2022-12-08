import datetime
from dateutil.relativedelta import relativedelta
import stripe

from accounts.models import User, StripeCustomerInfo, Payment, UserClass
from tfcbackend import settings


def check_payments():
    """
    A scheduled job that checks whether payments are due today.
    If they are, create a new Payment instance.
    """
    # check through all users, find active subscription
    for user in User.objects.all():
        if user.subscription:
            if user.paid_until == datetime.date.today():
                # payment is due
                stripe_customer = StripeCustomerInfo.objects.get(user_id=user.id)
                stripe.api_key = settings.STRIPE_SECRET_KEY
                stripe_pm = stripe.PaymentMethod.retrieve(stripe_customer.stripe_payment_method_id)
                Payment.objects.create(user_id=user.id,
                                       amount=user.subscription.price,
                                       last4=stripe_pm["card"]["last4"],
                                       exp_year=stripe_pm["card"]["exp_year"],
                                       exp_month=stripe_pm["card"]["exp_month"])
                # update user paid_until field
                if user.subscription.plan == 0:
                    months = 1
                else:
                    months = 12
                paid_until = datetime.date.today() + relativedelta(months=months)
                user.paid_until = paid_until
                user.save()

def drop_classes():
    """
    A scheduled job that checks whether a user is enrolled in a class and
    it is past their subscription date. If they are, drop them from their classes.
    """
    for user in User.objects.all():
        # If the user has no subscription, and their last day of their subscription has passed, 
        # drop classes after their billing period
        if not user.subscription and datetime.date.today() < user.paid_until:
            for user_class in UserClass.objects.filter(user_id=user.id):
                user_class.dropped = True
                user_class.save()