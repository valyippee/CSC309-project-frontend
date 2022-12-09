from django.urls import path
from studios.views.class_filters import ClassListView
from studios.views.studio_filters import StudioListView, StudioFilterTagsView
from studios.views.studio_info import StudioInfoView, get_coach_and_class_names
from studios.views.class_actions import ClassEnrolView, ClassDropView
from studios.views.class_user_schedule import ClassScheduleView, ClassHistoryView

app_name = 'studios'

urlpatterns = [
    path('tags/', StudioFilterTagsView.as_view(), name="studios-tags"),
    path('<studio_id>/', StudioInfoView.as_view(), name="studio"),
    path('classes/<class_id>/enrol/', ClassEnrolView.as_view(), name="class-enrol"),
    path('classes/<class_id>/drop/', ClassDropView.as_view(), name="class-drop"),
    path('list/<location>/', StudioListView.as_view({'get': 'list'}), name='studios'),
    path('<studio_id>/classes/', ClassListView.as_view({'get': 'list'}), name='studios-classes'),
    path('classes/schedule/', ClassScheduleView.as_view(), name='class-schedule'),
    path('classes/history/', ClassHistoryView.as_view(), name='class-history'),
    path('<studio_id>/coach-and-class/', get_coach_and_class_names, name='studio-coach-and-class'),
]
