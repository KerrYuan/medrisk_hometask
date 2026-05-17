from django.contrib import admin

from .models import Assessment, AuditEvent, ReviewNote


@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ("candidate_name", "employer_name", "role_title", "risk_level", "status", "submitted_at")
    list_filter = ("risk_level", "status")
    search_fields = ("candidate_name", "employer_name", "role_title")


admin.site.register(ReviewNote)
admin.site.register(AuditEvent)
