from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime
from accounts.models import User

# Create your models here.

class StudioImage(models.Model):
    studio_image = models.ImageField(upload_to="studio_images/")

class Amenity(models.Model):
    amenity_type = models.CharField(max_length=200)
    quantity = models.IntegerField()

    def __str__(self) -> str:
        return self.amenity_type + " (" + str(self.quantity) + ")"

class Studio(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    lat = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)]) # latitude
    lon = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)]) # longitude
    postal_code = models.CharField(max_length=32)
    phone_number = models.CharField(max_length=15)
    images = models.ManyToManyField(StudioImage, blank=True)
    amenities = models.ManyToManyField(Amenity, blank=True)

    def __str__(self) -> str:
        return self.name

class ClassKeyword(models.Model):
    keyword = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.keyword

class StudioClass(models.Model):
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6

    DAYS = (
        (MONDAY, 'Monday'),
        (TUESDAY, 'Tuesday'),
        (WEDNESDAY, 'Wednesday'),
        (THURSDAY, 'Thursday'),
        (FRIDAY, 'Friday'),
        (SATURDAY, 'Saturday'),
        (SUNDAY, 'Sunday')
    )

    studio = models.ForeignKey(Studio, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    class_name = models.CharField(max_length=200)
    coach = models.CharField(max_length=200)
    keywords = models.ManyToManyField(ClassKeyword, blank=True)
    capacity = models.IntegerField()
    day = models.IntegerField(choices=DAYS) # day of the recurring class
    start_time = models.TimeField()
    end_time = models.TimeField()
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    cancelled = models.BooleanField(default=False) # cancelled indefinitely
    date_cancelled = models.DateTimeField(null=True, blank=True)
    changed = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.class_name

class UserClass(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    studio_class = models.ForeignKey(StudioClass, on_delete=models.CASCADE)
    date_enrolled = models.DateTimeField(auto_now_add=True)
    dropped = models.BooleanField(default=False)  # dropped indefinitely
    date_dropped = models.DateTimeField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)  # if class is dropped indefinitely, end_date = date_dropped

class EnrolledClassInstance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    studio_class = models.ForeignKey(StudioClass, on_delete=models.CASCADE)
    class_date = models.DateField()

class DroppedClassInstance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    studio_class = models.ForeignKey(StudioClass, on_delete=models.CASCADE)
    date_dropped = models.DateField()

    def __str__(self) -> str:
        return str(self.studio_class_id) + " (" + datetime.strftime(self.date_dropped, '%Y-%m-%d') + ")"

class CancelledClassInstance(models.Model):
    studio_class = models.ForeignKey(StudioClass, on_delete=models.CASCADE)
    date_cancelled = models.DateField()

    def __str__(self) -> str:
        return str(self.studio_class_id) + " (" + datetime.strftime(self.date_cancelled, '%Y-%m-%d') + ")"

class TimeChangedClassInstance(models.Model):
    studio_class = models.ForeignKey(StudioClass, on_delete=models.CASCADE)
    new_start_time = models.TimeField()
    new_end_time = models.TimeField()
    date = models.DateField()

class UserClassInstance(models.Model):
    """
    Create this object when sending schedule or history data for class instances
    """
    ATTENDED = 0
    DROPPED = 1
    CANCELLED = 2

    status_choices = (
        (ATTENDED, 'Attended'),
        (DROPPED, 'Dropped'),
        (CANCELLED, 'Cancelled'),
    )

    studio = models.ForeignKey(Studio, on_delete=models.CASCADE)
    studio_class = models.ForeignKey(StudioClass, on_delete=models.CASCADE)
    class_name = models.CharField(max_length=200)
    start_time = models.TimeField()
    end_time = models.TimeField()
    date = models.DateField()
    status = models.CharField(max_length=200, choices=status_choices, default=ATTENDED)
    studio_name = models.CharField(max_length=200)
    coach = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    is_recurring = models.BooleanField(default=True)

class StudioClassInstance(models.Model):
    """
    Create this object when sending studio schedules for class instances
    """
    studio_class = models.ForeignKey(StudioClass, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    class_name = models.CharField(max_length=200)
    coach = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)