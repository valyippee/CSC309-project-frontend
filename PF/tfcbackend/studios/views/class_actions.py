from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.response import Response
from ..serializers import UserClassSerializer, DroppedClassInstanceSerializer
from ..models import StudioClass, UserClass, DroppedClassInstance, EnrolledClassInstance
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from datetime import date, datetime
from dateutil import relativedelta


class ClassEnrolView(CreateAPIView):
    """
    POST /api/studios/classes/<class_id>/enrol
    
    Allows user to enrol in a class.
    """

    serializer_class = UserClassSerializer
    permission_classes = [IsAuthenticated]

    def isUserEnrolled(self, class_id, user_id):
        return UserClass.objects.filter(studio_class_id=class_id, user_id=user_id).exists()

    def getNumEnrolments(self, class_to_enrol):
        all_user_classes = UserClass.objects.all()
        numOfEnrollment = 0
        for obj in all_user_classes:
            if class_to_enrol.id == obj.studio_class_id and obj.dropped == False:
                numOfEnrollment += 1
        return numOfEnrollment

    def isClassFull(self, class_to_enrol):
        numOfEnrollment = self.getNumEnrolments(class_to_enrol)

        if numOfEnrollment >= class_to_enrol.capacity:
            return True
        else:
            return False

    def isClassFullInstance(self, class_to_enrol, class_date):
        numOfEnrollments = self.getNumEnrolments(class_to_enrol)

        single_enrolments = EnrolledClassInstance.objects.filter(studio_class=class_to_enrol,
                                                                 class_date=class_date).count()

        if numOfEnrollments + single_enrolments >= class_to_enrol.capacity:
            return True
        else:
            return False

    def isAlreadyEnrolled(self, class_to_enrol, user):
        alreadyEnrolled = UserClass.objects.filter(studio_class_id=class_to_enrol.id, user_id=user.id,
                                                   dropped=False).exists()
        return alreadyEnrolled

    def isAlreadyEnrolledInstance(self, class_to_enrol, user, date_enrolled):
        alreadyEnrolled = EnrolledClassInstance.objects.filter(studio_class_id=class_to_enrol.id, user_id=user.id,
                                                               class_date=date_enrolled).exists()
        return alreadyEnrolled

    def classInstanceExists(self, class_to_enrol, date_enrolled):
        """
        Check if the class instance exists on the date given
        """
        studio_class = StudioClass.objects.get(id=class_to_enrol)
        start_day = studio_class.day

        if date_enrolled < studio_class.start_date:
            return False
        if date_enrolled > studio_class.end_date:
            return False
        if date_enrolled.weekday() != studio_class.day:
            return False

        return True

    def create(self, request, *args, **kwargs):
        ERROR_CODES = {"CANCELLED": 0, "ALREADY_ENROLLED": 1, "FULL": 2, "NOT_SUBSCRIBED": 3, "CHANGED": 4}

        studio_class = get_object_or_404(StudioClass, id=self.kwargs['class_id'])
        if studio_class.cancelled:
            data = {"error_code": ERROR_CODES["CANCELLED"], "error_msg": "Class has been cancelled"}
            return Response(status=status.HTTP_404_NOT_FOUND, data=data)
        if studio_class.changed:
            data = {"error_code": ERROR_CODES["CHANGED"], "error_msg": "Class does not exist"}
            return Response(status=status.HTTP_404_NOT_FOUND, data=data)
        elif request.user.subscription is None:
            data = {"error_code": ERROR_CODES["NOT_SUBSCRIBED"],
                    "error_msg": "User does not have an active subscription"}
            return Response(status=status.HTTP_404_NOT_FOUND, data=data)

        # No request date, enrol in all class instances
        if request.data.get("date") is None:
            print("ENROLLING IN ALL CLASS INSTANCES")
            if self.isClassFull(studio_class):
                data = {"error_code": ERROR_CODES["FULL"], "error_msg": "Class is full"}
                return Response(status=status.HTTP_404_NOT_FOUND, data=data)
            elif self.isAlreadyEnrolled(studio_class, request.user):
                data = {"error_code": ERROR_CODES["ALREADY_ENROLLED"],
                        "error_msg": "User is already enrolled in this class"}
                return Response(status=status.HTTP_404_NOT_FOUND, data=data)

            user_class = UserClass(user_id=request.user.id, studio_class_id=studio_class.id)
            user_class.save()

            # Delete all upcoming enrolled instances as we now enrol in all class instances
            EnrolledClassInstance.objects.filter(
                user_id=request.user.id, studio_class_id=studio_class.id,
                class_date__gte=datetime.now().date()).delete()

            # Delete dropped class instances as we now enrol in all instances
            DroppedClassInstance.objects.filter(user_id=request.user.id, studio_class_id=studio_class.id).delete()

        # Request date given, enrol in single class instance
        else:
            print("ENROLLING IN ONE CLASS")
            dateString = request.data["date"]
            date_to_enrol = date.fromisoformat(dateString)
            print(date_to_enrol)

            if self.isClassFullInstance(studio_class, date_to_enrol):
                data = {"error_code": ERROR_CODES["FULL"], "error_msg": "Class is full"}
                return Response(status=status.HTTP_404_NOT_FOUND, data=data)
            elif self.isAlreadyEnrolledInstance(studio_class, request.user, date_to_enrol):
                data = {"error_code": ERROR_CODES["ALREADY_ENROLLED"],
                        "error_msg": "User is already enrolled in this class instance"}
                return Response(status=status.HTTP_404_NOT_FOUND, data=data)
            elif self.isAlreadyEnrolled(studio_class, request.user):
                # If user is already enrolled in entire class instance, drop the DroppedClassInstance if it exists
                DroppedClassInstance.objects.filter(user_id=request.user.id, studio_class_id=studio_class.id,
                                                    date_dropped=date_to_enrol).delete()
                data = {"error_code": ERROR_CODES["ALREADY_ENROLLED"],
                        "error_msg": "User is already enrolled in this class"}
                return Response(status=status.HTTP_404_NOT_FOUND, data=data)
            elif not self.classInstanceExists:
                data = {"error_code": ERROR_CODES["ALREADY_ENROLLED"],
                        "error_msg": "The class requested does not exist"}
                return Response(status=status.HTTP_404_NOT_FOUND, data=data)

            # Drop the dropped class instance if it exists
            DroppedClassInstance.objects.filter(user_id=request.user.id, studio_class_id=studio_class.id,
                                                date_dropped=date_to_enrol).delete()
            # Create the enrolled class instance
            enrolledClassInstance = EnrolledClassInstance(user_id=request.user.id, studio_class_id=studio_class.id,
                                                          class_date=date_to_enrol)

            enrolledClassInstance.save()

        return Response(status=status.HTTP_201_CREATED)


class ClassDropView(CreateAPIView, UpdateAPIView):
    """ 
    POST /api/studios/classes/<class_id>/drop
    PATCH /api/studios/classes/<class_id>/drop
    
    Allows user to drop a class or an instance of a class
    """

    serializer_class = DroppedClassInstanceSerializer
    permission_classes = [IsAuthenticated]

    def get_error_codes(self, errorType):
        # Possibly restrict how long before user can drop a class from the start time/date?
        ERROR_CODES = {"CANCELLED": 0, "NOT_ENROLLED": 1, "ALREADY_DROPPED": 2}
        return ERROR_CODES[errorType]

    def isUserEnrolled(self, class_id, user_id):
        return UserClass.objects.filter(studio_class_id=class_id, user_id=user_id).exists()

    def isClassAlreadyDropped(self, class_id, user_id, date_dropped):
        dropped_class_instance_exists = DroppedClassInstance.objects.filter(studio_class_id=class_id, user_id=user_id,
                                                                            date_dropped=date_dropped).exists()
        class_fully_dropped = not UserClass.objects.filter(studio_class_id=class_id, user_id=user_id,
                                                           dropped=False).exists()
        if dropped_class_instance_exists or class_fully_dropped:
            return True
        else:
            return False

    def isClassFullyDropped(self, class_id, user_id):
        class_fully_dropped = not UserClass.objects.filter(studio_class_id=class_id, user_id=user_id,
                                                           dropped=False).exists()
        return class_fully_dropped

    # Drop a class instance
    def create(self, request, *args, **kwargs):
        if request.data.get("date") is None:
            raise ValidationError({"error_msg": "date field is needed in payload"})

        studio_class = get_object_or_404(StudioClass, id=kwargs["class_id"])
        date_string = request.data["date"]
        date_dropped = date.fromisoformat(date_string)
        # Find the enrolled class instance if it exists
        enrolled_instance = EnrolledClassInstance.objects.filter(studio_class_id=studio_class.id,
                                                                 user_id=request.user.id,
                                                                 class_date=date_dropped)
        if studio_class.cancelled:
            data = {"error_code": self.get_error_codes("CANCELLED"), "error_msg": "Class has been cancelled"}
            return Response(status=status.HTTP_404_NOT_FOUND, data=data)
        elif not self.isUserEnrolled(studio_class.id, request.user.id):
            if not enrolled_instance.exists():  # user not enrolled in class and class instance
                data = {"error_code": self.get_error_codes("NOT_ENROLLED"),
                        "error_msg": "User is not enrolled in class instance"}
                return Response(status=status.HTTP_404_NOT_FOUND, data=data)
        elif self.isUserEnrolled(studio_class.id, request.user.id):
            if self.isClassAlreadyDropped(studio_class.id, request.user.id, request.data["date"]) and \
                    not enrolled_instance.exists():
                # user is enrolled but dropped the class and did not enroll in this class instance
                data = {"error_code": self.get_error_codes("ALREADY_DROPPED"),
                        "error_msg": "Class has already been dropped by user"}
                return Response(status=status.HTTP_404_NOT_FOUND, data=data)

        enrolled_instance.delete()
        DroppedClassInstance.objects.create(user_id=request.user.id, studio_class_id=studio_class.id,
                                            date_dropped=date_dropped)

        return Response(status=status.HTTP_201_CREATED)

    # Drop all class instances
    def update(self, request, *args, **kwargs):
        studio_class = get_object_or_404(StudioClass, id=self.kwargs['class_id'])
        if studio_class.cancelled:
            data = {"error_code": self.get_error_codes("CANCELLED"), "error_msg": "Class has been cancelled"}
            return Response(status=status.HTTP_404_NOT_FOUND, data=data)
        elif not self.isUserEnrolled(studio_class.id, request.user.id):
            data = {"error_code": self.get_error_codes("NOT_ENROLLED"), "error_msg": "User is not enrolled in class"}
            return Response(status=status.HTTP_404_NOT_FOUND, data=data)
        elif self.isClassFullyDropped(studio_class.id, request.user.id):
            data = {"error_code": self.get_error_codes("ALREADY_DROPPED"), "error_msg": "Class has already been "
                                                                                        "dropped by user"}
            return Response(status=status.HTTP_404_NOT_FOUND, data=data)

        user_class = UserClass.objects.get(studio_class_id=studio_class.id, user_id=request.user.id, dropped=False)
        if request.data.get("date", None):
            user_class.end_date = date.fromisoformat(request.data.get("date")) - relativedelta.relativedelta(days=7)
        else:
            user_class.dropped = True
            user_class.date_dropped = datetime.now()
            user_class.end_date = datetime.now().date()
        user_class.save()

        # Remove the enrolled class instances if exists
        EnrolledClassInstance.objects.filter(studio_class_id=studio_class.id, user_id=request.user.id).delete()

        return Response(status=status.HTTP_200_OK)
