from django.db import models


class Assessment(models.Model):
    class RiskLevel(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"

    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_REVIEW = "in_review", "In review"
        REQUIRES_FOLLOW_UP = "requires_follow_up", "Requires follow-up"
        CLEARED = "cleared", "Cleared"
        NOT_CLEARED = "not_cleared", "Not cleared"

    candidate_name = models.CharField(max_length=160)
    role_title = models.CharField(max_length=160)
    employer_name = models.CharField(max_length=160)
    submitted_at = models.DateTimeField()
    risk_level = models.CharField(max_length=20, choices=RiskLevel.choices)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.NEW)
    clinician = models.CharField(max_length=160, blank=True)
    flags = models.JSONField(default=list, blank=True)
    summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self) -> str:
        return f"{self.candidate_name} - {self.role_title}"


class ReviewNote(models.Model):
    assessment = models.ForeignKey(Assessment, related_name="notes", on_delete=models.CASCADE)
    author = models.CharField(max_length=160)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class AuditEvent(models.Model):
    assessment = models.ForeignKey(Assessment, related_name="audit_events", on_delete=models.CASCADE)
    action = models.CharField(max_length=120)
    actor = models.CharField(max_length=160)
    previous_status = models.CharField(max_length=30, blank=True)
    new_status = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
