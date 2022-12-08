from django.db import models


class Subscription(models.Model):
    MONTHLY = 0
    YEARLY = 1

    PLANS = (
        (MONTHLY, 'Monthly'),
        (YEARLY, 'Yearly')
    )

    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    plan = models.IntegerField(choices=PLANS)

    def __str__(self):
        # Example: GymName (Monthly: $14.99)
        return self.name + " (" + self.get_plan_display() + ": $" + str(self.price) + ") "


class StripeSubscriptionInfo(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, null=False)
    stripe_price_id = models.CharField(max_length=150, null=False)
    stripe_product_id = models.CharField(max_length=150, null=False)
