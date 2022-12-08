import stripe
from django.contrib import admin
from django.conf import settings

from subscriptions.models import Subscription, StripeSubscriptionInfo
from accounts.models import User, StripeCustomerInfo

stripe.api_key = settings.STRIPE_SECRET_KEY


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    def _create_stripe_price(self, obj, stripe_product_id):
        """Helper function to create a stripe Price instance."""
        if obj.plan == 0:
            interval = "month"
        else:
            interval = "year"
        return stripe.Price.create(
            unit_amount=int(obj.price * 100),
            currency="cad",
            product=stripe_product_id,
            recurring={"interval": interval}
        )

    def save_model(self, request, obj, form, change):
        """Sync Stripe data with database when saving or updating a new Subscription instance."""
        if change:
            stripe_sub_info = StripeSubscriptionInfo.objects.get(subscription_id=obj.id)
            old_sub = Subscription.objects.get(id=obj.id)
            if obj.name != old_sub.name:
                stripe.Product.modify(stripe_sub_info.stripe_product_id, name=obj.name)
            if obj.price != old_sub.price or obj.plan != old_sub.plan:
                # update stripe subscriptions
                new_price = self._create_stripe_price(obj, stripe_sub_info.stripe_product_id)

                # update users who subscribed to this subscription
                users = User.objects.filter(subscription_id=obj.id)
                for user in users:
                    stripe_customer = StripeCustomerInfo.objects.get(user_id=user.id)
                    stripe_sub = stripe.Subscription.retrieve(stripe_customer.stripe_subscription_id)
                    # update subscription with new stripe Price object
                    stripe.Subscription.modify(
                        stripe_sub.id,
                        cancel_at_period_end=False,
                        proration_behavior='none',
                        items=[{
                            'id': stripe_sub['items']['data'][0].id,
                            'price': new_price["id"],
                        }]
                    )

                # update the old price to be inactive
                stripe.Price.modify(stripe_sub_info.stripe_price_id, active=False)

                stripe_sub_info.stripe_price_id = new_price["id"]
                stripe_sub_info.save()

        super().save_model(request, obj, form, change)

        if not change:
            # create corresponding stripe product and price
            stripe_product = stripe.Product.create(name=obj.name)
            new_price = self._create_stripe_price(obj, stripe_product["id"])
            StripeSubscriptionInfo.objects.create(subscription=obj,
                                                  stripe_price_id=new_price['id'],
                                                  stripe_product_id=stripe_product['id'])

    def delete_model(self, request, obj):
        """Sync Stripe data with database when deleting a Subscription instance."""
        # for all subscribed users, delete subscription in Stripe for this Product
        users = User.objects.filter(subscription_id=obj.id)
        for user in users:
            stripe_customer = StripeCustomerInfo.objects.get(user_id=user.id)
            stripe.Subscription.delete(stripe_customer.stripe_subscription_id)
            stripe_customer.stripe_subscription_id = None
            stripe_customer.save()

        # delete Product in stripe
        stripe_sub_info = StripeSubscriptionInfo.objects.get(subscription_id=obj.id)
        stripe.Product.modify(stripe_sub_info.stripe_product_id, active=False)

        super().delete_model(request, obj)
