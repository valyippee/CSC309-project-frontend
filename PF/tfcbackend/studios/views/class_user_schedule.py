from rest_framework.exceptions import ValidationError

from ..serializers import UserClassInstanceSerializer
from ..models import StudioClass, CancelledClassInstance, DroppedClassInstance, UserClass, TimeChangedClassInstance, \
    UserClassInstance, Studio, EnrolledClassInstance
from datetime import datetime, timedelta, date
from dateutil import relativedelta
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated


def generateListOfDates(start_date, end_date, day, starting_time, weeks, is_history):
    """Generates a list of dates repeated weekly on a specific day in the range [start_date, end_date]."""
    dates = []

    if end_date and start_date > end_date:
        return []

    today = datetime.now().date()

    current_date = start_date
    current_time = datetime.now().time()

    num_days_from_current_date = (day - current_date.weekday()) % 7
    num_weeks = 0  # counter for weeks

    if num_days_from_current_date == 0:
        if current_time > starting_time:
            current_date += timedelta(days=7)
            num_weeks += 1
    else:
        current_date = current_date + timedelta(days=num_days_from_current_date)

    # Set the number of weeks to generate
    weeks = int(weeks)

    while num_weeks < weeks:
        num_weeks += 1
        if (end_date and current_date <= end_date) or not end_date:
            # We need to check if the date is today
            if current_date == today:
                # Do not append to history if class is in the future
                if is_history and current_time <= starting_time:
                    continue
                # Do not append to schedule if class is in the past
                if not is_history and current_time > starting_time:
                    continue
            dates.append(current_date)
            current_date += timedelta(days=7)

    return dates


class ClassScheduleView(ListAPIView):
    serializer_class = UserClassInstanceSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        # Fresh Slate of User Class Instance Table
        UserClassInstance.objects.all().delete()

        request = self.request
        weeks = request.query_params.get('weeks', 1)  # Default for weeks is 1 week
        start_date = datetime.now().date()  # Default for start date is today
        if request.query_params.get("start_date"):
            input_date = date.fromisoformat(request.query_params.get("start_date"))
            if input_date >= start_date:
                start_date = input_date
            else:
                raise ValidationError({"error_msg": "start_date needs to be after today"})

        all_user_classes = UserClass.objects.filter(user_id=request.user.id)
        all_dropped_class_instances = DroppedClassInstance.objects.filter(date_dropped__gte=start_date)
        all_cancelled_class_instances = CancelledClassInstance.objects.filter(date_cancelled__gte=start_date)
        all_time_changed_class_instances = TimeChangedClassInstance.objects.filter(date__gte=start_date)

        for user_class in all_user_classes:
            studio_class = StudioClass.objects.get(id=user_class.studio_class_id)

            if studio_class.changed:
                continue

            # Check if class has been fully dropped or cancelled or if this class is not the latest one
            if not user_class.dropped and not studio_class.cancelled:
                # Generate dates to loop through
                if user_class.end_date:
                    # user's last day to attend class
                    target_date = user_class.end_date
                else:
                    target_date = studio_class.end_date

                class_dates = generateListOfDates(start_date, target_date, studio_class.day,
                                                  studio_class.start_time, weeks, False)
                today = datetime.now()

                # For each date, check if an instance of a class has been dropped or cancelled,
                # or that the class is today but has already started.
                # If not any of the above, create a UserClassInstance
                for class_date in class_dates:
                    if not (all_dropped_class_instances.filter(user_id=request.user.id,
                                                               studio_class_id=user_class.studio_class_id,
                                                               date_dropped=class_date).exists()
                            or all_cancelled_class_instances.filter(studio_class_id=user_class.studio_class_id,
                                                                    date_cancelled=class_date).exists()) \
                            or (class_date == today.date() and studio_class.start_time < today.time()):
                        start_time = studio_class.start_time
                        end_time = studio_class.end_time
                        if all_time_changed_class_instances.filter(studio_class_id=user_class.studio_class_id,
                                                                   date=class_date).exists():
                            time_changed_class_instance = all_time_changed_class_instances.get(
                                studio_class_id=user_class.studio_class_id, date=class_date)
                            start_time = time_changed_class_instance.new_start_time
                            end_time = time_changed_class_instance.new_end_time

                        studio = Studio.objects.get(id=studio_class.studio.id)
                        UserClassInstance.objects.create(studio_id=studio_class.studio_id,
                                                         studio_class_id=studio_class.id,
                                                         class_name=studio_class.class_name,
                                                         start_time=start_time,
                                                         end_time=end_time, date=class_date,
                                                         studio_name=studio.name, coach=studio_class.coach,
                                                         description=studio_class.description)

        end_date = start_date + timedelta(weeks=int(weeks))
        enrolled_instances = EnrolledClassInstance.objects.filter(user_id=request.user.id, class_date__gte=start_date,
                                                                  class_date__lte=end_date)

        # Add the enrolled class instances
        for enrolled_instance in enrolled_instances:

            studio_class = StudioClass.objects.get(id=enrolled_instance.studio_class.id)

            # If the class was today, check if the time has already passed
            if enrolled_instance.class_date == datetime.now().date():
                # Class has already passed today, don't create a UserInstance
                if datetime.now().time() > studio_class.start_time:
                    continue

            # Check if the class date was changed - if it was, don't include it
            if studio_class.changed:
                continue

            UserClassInstance.objects.create(studio_id=studio_class.studio_id,
                                             studio_class_id=studio_class.id,
                                             class_name=studio_class.class_name,
                                             start_time=studio_class.start_time,
                                             end_time=studio_class.end_time, date=enrolled_instance.class_date,
                                             studio_name=studio_class.studio.name, coach=studio_class.coach,
                                             description=studio_class.description,
                                             is_recurring=False)

        all_user_class_instances = UserClassInstance.objects.all().order_by('date', "start_time")
        return all_user_class_instances


class ClassHistoryView(ListAPIView):
    serializer_class = UserClassInstanceSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_status_code(self, msg):
        # Matches codes defined in UserClassInstance Model
        status_codes = {"ATTENDED": 0, "DROPPED": 1, "CANCELLED": 2}
        return status_codes[msg]

    def get_queryset(self):
        """Return classes starting from <start_date>, up till a certain number of weeks."""
        # Fresh Slate of User Class Instance Table
        UserClassInstance.objects.all().delete()

        request = self.request
        end_date = date.today()
        weeks = request.query_params.get('weeks', 4)  # default for weeks is 4 weeks
        start_date = datetime.now().date()  # default for start date is one month before today
        if request.query_params.get("start_date"):
            input_date = date.fromisoformat(request.query_params.get("start_date"))
            if input_date > start_date:
                raise ValidationError({"error_msg": "start_date needs to be before today"})
            else:
                start_date = input_date
        else:
            start_date -= relativedelta.relativedelta(months=1)

        all_user_classes = UserClass.objects.filter(user_id=request.user.id)
        all_dropped_class_instances = DroppedClassInstance.objects.filter(date_dropped__lte=end_date)
        all_cancelled_class_instances = CancelledClassInstance.objects.filter(date_cancelled__lte=end_date)
        all_time_changed_class_instances = TimeChangedClassInstance.objects.filter(date__lte=end_date)

        for user_class in all_user_classes:
            studio_class = StudioClass.objects.get(id=user_class.studio_class_id)

            if studio_class.changed:
                continue

            # Generate dates to loop through
            if user_class.end_date and user_class.end_date < end_date:
                target_end_date = user_class.end_date
            elif studio_class.cancelled and studio_class.date_cancelled.date() < end_date:
                target_end_date = studio_class.date_cancelled.date()
            else:
                target_end_date = end_date

            class_dates = generateListOfDates(start_date, target_end_date, studio_class.day,
                                              studio_class.start_time, weeks, True)
            # For each date, check if an instance of a class has been dropped or cancelled,
            # if not create a UserClassInstance
            today = datetime.now()
            for class_date in class_dates:
                if class_date < user_class.date_enrolled.date() or \
                        (class_date == today.date() and studio_class.start_time > today.time()):
                    # don't generate a class instance if the user was not enrolled before this
                    # or if the class has NOT started
                    continue
                if all_dropped_class_instances.filter(user_id=request.user.id,
                                                      studio_class_id=user_class.studio_class_id,
                                                      date_dropped=class_date).exists():
                    status = self.get_status_code("DROPPED")
                elif all_cancelled_class_instances.filter(studio_class_id=user_class.studio_class_id,
                                                          date_cancelled=class_date).exists():
                    status = self.get_status_code("CANCELLED")
                else:
                    status = self.get_status_code("ATTENDED")
                start_time = studio_class.start_time
                end_time = studio_class.end_time
                if all_time_changed_class_instances.filter(studio_class_id=user_class.studio_class_id,
                                                           date=class_date).exists():
                    time_changed_class_instance = all_time_changed_class_instances.get(
                        studio_class_id=user_class.studio_class_id, date=class_date)
                    start_time = time_changed_class_instance.new_start_time
                    end_time = time_changed_class_instance.new_end_time

                studio = Studio.objects.get(id=studio_class.studio.id)
                UserClassInstance.objects.create(studio_id=studio_class.studio_id,
                                                 studio_class_id=studio_class.id,
                                                 class_name=studio_class.class_name, start_time=start_time,
                                                 end_time=end_time, date=class_date, status=status,
                                                 studio_name=studio.name, coach=studio_class.coach,
                                                 description=studio_class.description)

        end_date = start_date + timedelta(weeks=int(weeks))

        # If end date is greater than today, set it today because history should only go up to today
        if end_date > datetime.now().date():
            end_date = datetime.now().date()

        enrolled_instances = EnrolledClassInstance.objects.filter(user_id=request.user.id, class_date__gte=start_date,
                                                                  class_date__lte=end_date)

        # Add the enrolled class instances
        for enrolled_instance in enrolled_instances:

            studio_class = StudioClass.objects.get(id=enrolled_instance.studio_class.id)

            # If the class was today, check if the time was before today
            if enrolled_instance.class_date == datetime.now().date():
                # Class has already not passed yet today, don't create a UserInstance
                if datetime.now().time() <= studio_class.start_time:
                    continue

            # Check if the class date was changed - if it was, don't include it
            if studio_class.changed:
                continue

            # Check if enrolled classes were cancelled
            if all_cancelled_class_instances.filter(studio_class_id=studio_class.id,
                                                    date_cancelled=enrolled_instance.class_date).exists():
                status = self.get_status_code("CANCELLED")
            else:
                status = self.get_status_code("ATTENDED")

            UserClassInstance.objects.create(studio_id=studio_class.studio_id,
                                             studio_class_id=studio_class.id,
                                             class_name=studio_class.class_name,
                                             start_time=studio_class.start_time,
                                             end_time=studio_class.end_time, date=enrolled_instance.class_date,
                                             status=status,
                                             studio_name=studio_class.studio.name, coach=studio_class.coach,
                                             description=studio_class.description,
                                             is_recurring=False)

        all_user_class_instances = UserClassInstance.objects.all().order_by('-date', '-start_time')
        return all_user_class_instances
