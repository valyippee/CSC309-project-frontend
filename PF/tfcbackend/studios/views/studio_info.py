from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.generics import RetrieveAPIView
from ..serializers import StudioSerializer
from ..models import Studio, StudioClass
from django.shortcuts import get_object_or_404
from rest_framework.response import Response


class StudioInfoView(RetrieveAPIView):
    serializer_class = StudioSerializer

    def get_object(self):
        return get_object_or_404(Studio, id=self.kwargs['studio_id'])


@api_view(['GET'])
def get_coach_and_class_names(request, studio_id):
    """Get all the coach and class names at this studio."""
    # studio_id = request.query_params.get("studio_id", None)
    if not Studio.objects.filter(id=studio_id).exists():
        raise ValidationError("studio with the given id does not exist")
    classes = list(StudioClass.objects.filter(studio_id=studio_id))
    coach_names = set()
    class_names = set()
    for _class in classes:
        coach_names.add(_class.coach)
        class_names.add(_class.class_name)
    return Response({
        "class_names": list(class_names),
        "coach_names": list(coach_names)
    })
