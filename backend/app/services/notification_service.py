"""Legacy shim — delegates to notification_management_service."""

from app.services.notification_management_service import (  # noqa: F401
    NotificationManagementService,
    clear_all_notifications,
    get_user_notifications,
    mark_notifications_read,
)
