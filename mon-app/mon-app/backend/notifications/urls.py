# backend/notifications/urls.py
from django.urls import path
from .views import NotificationListView, NotificationDetailView,ToggleReminderView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('events/<int:event_id>/toggle-reminder/', ToggleReminderView.as_view(), name='toggle-reminder'),
    
]