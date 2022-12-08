from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from ..serializers import StudioSerializer
from ..models import Studio, Amenity, StudioClass
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from geopy import distance

class StudioListView(viewsets.ModelViewSet):
    """
    GET /api/studios/list/<location>
    
    Studios must be listed based on geographic proximity from location parameter. 
    Location is a latitude,longitude pair (e.g. 43.656997372,-79.390331772)

    Studios can be filtered by name, amenities, class names, and coaches.
    """
    serializer_class = StudioSerializer

    def validate_location_input(self, location):
        """
        Validates the given location input and returns 400 BAD REQUEST if invalid input was given.
        Ensures that both latitude and longitude were sent, and both are of type float.

        Returns floats (latitude, longitude) from given location input.
        """
        try:
            lat = float(location[0])
            lon = float(location[1])

            if lat < -90 or lat > 90 or lon < -180 or lon > 180:
                raise ValidationError()

            return (lat, lon)
        except:
            raise ValidationError()

    def filter_studios(self, studio_name, amenity, class_name, coach, search):
        queryset = Studio.objects.all()

        if search:
            # Studio name match
            studio_name_matches = Studio.objects.filter(name__icontains=search).distinct()
            # Amenity match
            amenities = Amenity.objects.filter(amenity_type__icontains=search).values('amenity_type',)
            amenities_matches = Studio.objects.filter(amenities__amenity_type__in=amenities).distinct()
            # Class name match
            classes = StudioClass.objects.filter(class_name__icontains=search).values('studio_id',)
            class_name_matches = Studio.objects.filter(id__in=classes).distinct()
            # Coach match
            coaches = StudioClass.objects.filter(coach__icontains=search).values('studio_id',)
            coach_matches = Studio.objects.filter(id__in=coaches).distinct()
            queryset = queryset.filter(Q(id__in=studio_name_matches) | Q(id__in=amenities_matches) | \
                Q(id__in=class_name_matches) | Q(id__in=coach_matches))

        if studio_name:
            queryset = queryset.filter(name__in=studio_name).distinct()
        if amenity:
            amenities = Amenity.objects.filter(amenity_type__in=amenity).values('amenity_type',)
            queryset = queryset.filter(amenities__amenity_type__in=amenities).distinct()
        if class_name:
            classes = StudioClass.objects.filter(class_name__in=class_name).values('studio_id',)
            queryset = queryset.filter(id__in=classes).distinct()
        if coach:
            coaches = StudioClass.objects.filter(coach__in=coach).values('studio_id',)
            queryset = queryset.filter(id__in=coaches).distinct()
        
        return queryset

    def get_queryset(self):
        location = self.validate_location_input(self.kwargs['location'].split(','))    

        # Get the query params for studio name, amenities, class names, and coaches.
        studio_name = self.request.query_params.getlist('studio_name')
        amenity = self.request.query_params.getlist('amenity')
        class_name = self.request.query_params.getlist('class_name')
        coach = self.request.query_params.getlist('coach')
        search = self.request.query_params.get('search')

        queryset = self.filter_studios(studio_name, amenity, class_name, coach, search)
        
        # Sort by proximity
        queryset = sorted(queryset, key= lambda studio: distance.distance(location, (studio.lat, studio.lon)).km)

        return queryset

class StudioFilterTagsView(APIView):
    """
    GET /api/studios/tags/
    
    Returns an object that contains all tags necessary for filtering studios

    (Studio Names, Amenities, Class Names, coaches)
    """

    def get(self, request):
        all_studios = Studio.objects.all()
        all_amenities = Amenity.objects.all()
        all_classes = StudioClass.objects.all()

        studio_names = [studio.name for studio in all_studios]
        amenities = [amenity.amenity_type for amenity in all_amenities]
        amenities = list(dict.fromkeys(amenities))
        class_names = [studio_class.class_name for studio_class in all_classes]
        class_names = list(dict.fromkeys(class_names))
        coaches = [studio_class.coach for studio_class in all_classes]
        coaches = list(dict.fromkeys(coaches))
        
        return Response({"studio_names": studio_names, "amenities": amenities, "class_names": class_names, "coaches": coaches})
