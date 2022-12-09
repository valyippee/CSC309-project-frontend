from django.contrib import admin
from studios.models import Studio, StudioImage, Amenity, ClassKeyword, StudioClass, CancelledClassInstance, DroppedClassInstance, UserClass, TimeChangedClassInstance, EnrolledClassInstance
from datetime import date, datetime

# Register your models here.
admin.site.register(Studio)
admin.site.register(StudioImage)
admin.site.register(Amenity)
admin.site.register(ClassKeyword)
admin.site.register(CancelledClassInstance)
admin.site.register(TimeChangedClassInstance)
admin.site.register(UserClass)

class StudioClassAdmin(admin.ModelAdmin):

    readonly_fields=('changed',)

    class Meta:
        model = StudioClass

    def get_queryset(self, request):
        queryset = StudioClass.objects.filter(changed=False)
        return queryset

    # When updating the model with different start/end time, create a new model and end the previous model.
    def save_model(self, request, obj, form, change):
        new_start_time = obj.start_time if 'start_time' in form.changed_data else None
        new_end_time = obj.end_time if 'end_time' in form.changed_data else None
        new_day = obj.day if 'day' in form.changed_data else None

        today = date.today()

        # Nothing special needs to be done if the start times or day of class have not changed.
        if new_start_time is None and new_end_time is None and new_day is None:
            super().save_model(request, obj, form, change)
        else:
            # This class is now not going to be used again. Set its end time to today.
            obj = StudioClass.objects.get(id=obj.id)
            old_end_date = obj.end_date
            obj.end_date = today
            obj.changed = True
            obj.save()
            
            if new_start_time is None:
                new_start_time = obj.start_time
            if new_end_time is None:
                new_end_time = obj.end_time
            if new_day is None:
                new_day = obj.day

            # Create a new StudioClass instance
            new_class = StudioClass(
                studio=obj.studio,
                description=obj.description,
                class_name=obj.class_name,
                coach=obj.coach,
                capacity=obj.capacity,
                day=new_day,
                start_time=new_start_time,
                end_time=new_end_time,
                start_date=today,
                end_date=old_end_date,
                cancelled=obj.cancelled,
                date_cancelled=obj.date_cancelled
                )

            new_class.save()
            
            # Add the keywords 
            for keyword in obj.keywords.all():
                new_class.keywords.add(keyword)

            # Add the users of the old class to the new class and drop the old class
            user_classes = UserClass.objects.filter(studio_class_id=obj.id)

            for user_class in user_classes:
                user_class.dropped = True
                user_class.date_dropped = datetime.now().date()
                new_user_class = UserClass(user=user_class.user, studio_class=new_class)
                new_user_class.save()


admin.site.register(StudioClass, StudioClassAdmin)
