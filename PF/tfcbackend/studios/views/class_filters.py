from rest_framework import viewsets
from ..serializers import ClassInstanceSerializer
from ..models import StudioClass, CancelledClassInstance, StudioClassInstance, TimeChangedClassInstance
from datetime import datetime, timedelta, date
from rest_framework.exceptions import ValidationError
from django.db.models import Q


class ClassListView(viewsets.ModelViewSet):
    """
    GET /api/studios/<studio_id>/classes
    
    Returns a list of classes for studio id, ordered by their start time from now.

    Classes can be filtered by class name, coach name, date, and time range.
    """
    serializer_class = ClassInstanceSerializer
    pagination_class = None

    def get_dates(self, start_date, end_date, day, start_time, weeks):
        """
        Get the classes between start_date and end_date starting on <day> day of the week after start_date, for <weeks> weeks into the future.
        """
        dates = []

        today = datetime.now()
        num_days_from_today = (day - today.weekday()) % 7
        num_days_from_startdate = (day - start_date.weekday()) % 7

        # Default is 1 for weeks to fetch
        if weeks is None:
            weeks = 1
        else:
            weeks = int(weeks)

        num_weeks = 0  # initialize counter for the number of weeks we have fetched

        # The next occurence of the class from now (or start date, if start date is later than today)
        if datetime.combine(start_date, start_time) > today:
            current_date = datetime.combine(start_date + timedelta(days=num_days_from_startdate), start_time)
        else:
            current_date = datetime.combine(today.date() + timedelta(days=num_days_from_today), start_time)

        # Add all occurences of class to the dates list
        while num_weeks < weeks:
            num_weeks += 1
            if (end_date is not None and current_date <= datetime.combine(end_date, start_time)) or end_date is None:
                dates.append(current_date.date())
                current_date += timedelta(days=7)

        return dates

    def filter_classes(self, studio_id, class_name, coach, class_day, start_time, end_time):
        """
        Helper function for get_queryset. Filters by the given parameters, if they are not None
        """
        queryset = StudioClass.objects.all().filter(studio=studio_id).filter(cancelled=False)

        # Firstly, filter out classes that are already done
        today = datetime.now()
        queryset = queryset.filter(Q(end_date__gte=today) | Q(end_date__isnull=True))

        # Filter out classes that are cancelled indefinitely
        queryset = queryset.filter(cancelled=False)

        # Filter the rest of the parameters, if they were passed in
        if class_name:
            queryset = queryset.filter(class_name__in=class_name).distinct()
        if coach:
            queryset = queryset.filter(coach__in=coach).distinct()
        if start_time:
            try:
                start_time = datetime.strptime(start_time, '%H:%M').time()
                queryset = queryset.filter(start_time__gte=start_time).distinct()
            except:
                raise ValidationError({"message": "Invalid start time format"})
        if end_time:
            try:
                end_time = datetime.strptime(end_time, '%H:%M').time()
                queryset = queryset.filter(end_time__lte=end_time).distinct()
            except:
                raise ValidationError({"message": "Invalid end time format"})
        if class_day:
            queryset = queryset.filter(day=class_day).distinct()

        return queryset

    def get_queryset(self):
        """Return classes from <start_date>, up till <weeks> later."""
        StudioClassInstance.objects.all().delete()
        studio_id = self.kwargs['studio_id']

        class_name = self.request.query_params.getlist('class_name')
        coach = self.request.query_params.getlist('coach')
        class_day = self.request.query_params.get('class_day')
        start_time = self.request.query_params.get('start_time')
        end_time = self.request.query_params.get('end_time')
        weeks = self.request.query_params.get('weeks')
        start_date = self.request.query_params.get('start_date')
        if start_date:
            start_date = date.fromisoformat(start_date)
        else:
            start_date = datetime.now().date()  # defaults to today

        today = datetime.now()

        # First, filter our classes with the desired parameters
        queryset = self.filter_classes(studio_id, class_name, coach, class_day, start_time, end_time)

        for cls in queryset:
            # If the class was changed, skip over it
            if cls.changed:
                continue
            # Get all dates for the class
            dates = self.get_dates(start_date, cls.end_date, cls.day, cls.start_time, weeks)
            for cls_date in dates:
                # Make sure the class is not cancelled and after the given start day
                if not CancelledClassInstance.objects.filter(studio_class=cls.id, date_cancelled=cls_date).exists() \
                        and (today.date() < cls_date or (today.date() == cls_date and today.time() < cls.start_time)) \
                        and cls.start_date <= cls_date:
                    class_instance = StudioClassInstance(studio_class=cls, date=cls_date, start_time=cls.start_time,
                                                         end_time=cls.end_time)

                    # If the date has changed, update the date before saving
                    try:
                        time_change = TimeChangedClassInstance.objects.get(studio_class=cls.id, date=cls_date)
                        if datetime.combine(time_change.date, time_change.new_start_time) > today:
                            class_instance = StudioClassInstance(studio_class=cls, date=cls_date,
                                                                 start_time=time_change.new_start_time,
                                                                 end_time=time_change.new_end_time)
                    except:
                        pass

                    class_instance.save()

        # Order by date and start time
        queryset = StudioClassInstance.objects.all().order_by('date', "start_time").distinct()

        return queryset
