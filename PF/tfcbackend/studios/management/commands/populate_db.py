from django.core.management.base import BaseCommand
from studios.models import Studio, Amenity, StudioImage, StudioClass, ClassKeyword, UserClass
from accounts.models import User, StripeCustomerInfo, Payment
from subscriptions.models import Subscription, StripeSubscriptionInfo
from studios.management.commands.data import users, studios, subscriptions, classes
import stripe
from django.conf import settings

from override_autonow import override_autonow


stripe.api_key = settings.STRIPE_SECRET_KEY


class Command(BaseCommand):
    help = "populate database"

    @override_autonow
    def handle(self, *args, **options):
        # create studios
        for studio in studios:
            if not Studio.objects.filter(name=studio['name'], postal_code=studio['postal_code']).exists():
                new_studio = Studio.objects.create(
                    name=studio['name'],
                    address=studio['address'],
                    lat=studio['lat'],
                    lon=studio['lon'],
                    postal_code=studio['postal_code'],
                    phone_number=studio['phone_number'],
                )
                for amenity in studio['amenities']:
                    new_studio.amenities.add(Amenity.objects.create(amenity_type=amenity['amenity_type'], quantity=amenity['quantity']))
                for image in studio['images']:
                    # image is a string
                    studio_image = StudioImage()
                    studio_image.studio_image.name = 'pre_populated_data/' + image
                    studio_image.save()
                    new_studio.images.add(studio_image)

        # create subscription if does not exist
        for sub in subscriptions:
            if not Subscription.objects.filter(name=sub['name'], price=sub['price'], plan=sub['plan']).exists():
                new_sub = Subscription.objects.create(name=sub['name'], price=sub['price'], plan=sub['plan'])

                # create corresponding stripe product and price
                if sub['plan'] == 0:
                    interval = "month"
                else:
                    interval = "year"

                stripe_product = stripe.Product.create(name=sub['name'])
                new_price = stripe.Price.create(
                    unit_amount=int(sub['price'] * 100),
                    currency="cad",
                    product=stripe_product["id"],
                    recurring={"interval": interval}
                )
                StripeSubscriptionInfo.objects.create(subscription=new_sub,
                                                      stripe_price_id=new_price['id'],
                                                      stripe_product_id=stripe_product['id'])

        # create classes
        for _class in classes:
            for num in _class['studios']:
                # get the corresponding studio
                studio_name = studios[num - 1]['name']
                studio = Studio.objects.filter(name=studio_name)[0]

                if not StudioClass.objects.filter(studio=studio, class_name=_class['class_name']).exists():
                    new_class = StudioClass.objects.create(
                        studio=studio,
                        description=_class['description'],
                        class_name=_class['class_name'],
                        coach=_class['coach'],
                        capacity=_class['capacity'],
                        day=_class['day'],
                        start_time=_class['start_time'],
                        end_time=_class['end_time'],
                        start_date=_class['start_date'],
                        end_date=_class['end_date']
                    )
                    # add keywords
                    for keyword in _class['keywords']:
                        new_class.keywords.add(ClassKeyword.objects.create(keyword=keyword))

        # create user
        for user in users:
            if not User.objects.filter(email=user['email']).exists():
                new_user = User.objects.create(
                    first_name=user['first_name'],
                    last_name=user['last_name'],
                    email=user['email'],
                    phone_number=user['phone_number']
                )
                new_user.set_password(user['password'])

                # add avatar
                new_user.avatar.name = 'pre_populated_data/' + user['avatar']
                new_user.save()
                # create corresponding stripe customer
                customer = stripe.Customer.create(email=user['email'])
                stripe_customer_db = StripeCustomerInfo.objects.create(user_id=new_user.id, stripe_customer_id=customer['id'])

                # create payment method
                card_info = user['card_info']
                pm = stripe.PaymentMethod.create(
                    type="card",
                    card=card_info
                )
                stripe.PaymentMethod.attach(
                    pm["id"], customer=customer['id']
                )
                stripe.Customer.modify(
                    customer['id'],
                    invoice_settings={"default_payment_method": pm["id"]}
                )
                stripe_customer_db.stripe_payment_method_id = pm['id']

                # subscribe to a subscription
                if user['subscription'] != 0:
                    target_sub = subscriptions[user['subscription'] - 1]
                    sub = Subscription.objects.get(name=target_sub['name'])
                    sub_info = StripeSubscriptionInfo.objects.get(subscription_id=sub.id)
                    stripe_sub = stripe.Subscription.create(
                        customer=customer['id'],
                        items=[
                            {"price": sub_info.stripe_price_id}
                        ]
                    )
                    new_user.subscription = sub
                    stripe_customer_db.stripe_subscription_id = stripe_sub["id"]
                new_user.paid_until = user['paid_until']
                new_user.save()
                stripe_customer_db.save()

                # add payment history
                for payment in user['payment_history']:
                    Payment.objects.create(user_id=new_user.id,
                                           amount=payment['amount'],
                                           last4=payment['last4'],
                                           exp_month=payment['exp_month'],
                                           exp_year=payment['exp_year'],
                                           datetime=payment['datetime'])

                # enroll user in classes
                for _class in user['classes']:
                    studio_data = studios[_class['studio'] - 1]
                    studio_in_db = Studio.objects.get(name=studio_data['name'])
                    studio_class = StudioClass.objects.get(class_name=_class['class_name'], studio_id=studio_in_db.id)
                    new_user_class = UserClass.objects.create(user_id=new_user.id,
                                                              studio_class_id=studio_class.id,
                                                              date_enrolled=_class['date_enrolled'])
                    if _class['dropped']:
                        new_user_class.dropped = True
                        new_user_class.date_dropped = _class['date_dropped']
                        new_user_class.end_date = _class['date_dropped']
                    if 'end_date' in _class:
                        new_user_class.end_date = _class['end_date']

                    new_user_class.save()
