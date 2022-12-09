from rest_framework import serializers
from .models import Studio, StudioClass, UserClass, DroppedClassInstance, UserClassInstance, StudioClassInstance, Amenity, ClassKeyword, StudioImage

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'

class StudioImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudioImage
        fields = '__all__'

class StudioSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True)
    images = StudioImageSerializer(many=True)
    directions_url = serializers.SerializerMethodField()

    class Meta:
        model = Studio
        fields = ['id', 'name', 'address', 'lat', 'lon', 'postal_code', 'phone_number', 'images', 'amenities', 'directions_url']

    def get_directions_url(self, studio):
        return "https://www.google.com/maps/dir/?api=1&destination={},{}".format(studio.lat, studio.lon)

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassKeyword
        fields = '__all__'

class StudioClassSerializer(serializers.ModelSerializer):
    keywords = KeywordSerializer(many=True)

    class Meta:
        model = StudioClass
        fields = '__all__'

class UserClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserClass
        fields = '__all__'

class DroppedClassInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DroppedClassInstance
        fields = '__all__'

class UserClassInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserClassInstance
        fields = '__all__'

class StudioFilterSerializer(serializers.ModelSerializer):
    keywords = KeywordSerializer(many=True)

    class Meta:
        model = StudioClass
        fields = ['id', 'studio', 'description', 'class_name', 'coach', 'keywords', 'capacity', 'day']

class ClassInstanceSerializer(serializers.ModelSerializer):
    studio_class = StudioFilterSerializer(read_only=True)

    class Meta:
        model = StudioClassInstance
        fields = ['date', 'start_time', 'end_time', 'studio_class']