from rest_framework import serializers

from .domain import ALLOWED_STATUS_TRANSITIONS, is_valid_status_transition
from .models import Assessment, AuditEvent, ReviewNote


class ReviewNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewNote
        fields = ["id", "assessment", "author", "content", "created_at"]
        read_only_fields = ["id", "assessment", "created_at"]

    def validate_content(self, value: str) -> str:
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Review note must be at least 5 characters.")
        return value.strip()


class AuditEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditEvent
        fields = ["id", "action", "actor", "previous_status", "new_status", "created_at"]


class AssessmentListSerializer(serializers.ModelSerializer):
    flag_count = serializers.SerializerMethodField()

    class Meta:
        model = Assessment
        fields = [
            "id",
            "candidate_name",
            "role_title",
            "employer_name",
            "submitted_at",
            "risk_level",
            "status",
            "clinician",
            "flags",
            "flag_count",
            "summary",
        ]

    def get_flag_count(self, obj: Assessment) -> int:
        return len(obj.flags or [])


class AssessmentDetailSerializer(AssessmentListSerializer):
    notes = ReviewNoteSerializer(many=True, read_only=True)
    audit_events = AuditEventSerializer(many=True, read_only=True)

    class Meta(AssessmentListSerializer.Meta):
        fields = AssessmentListSerializer.Meta.fields + ["notes", "audit_events", "created_at", "updated_at"]


class StatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Assessment.Status.choices)
    actor = serializers.CharField(max_length=160, default="Dr Example")
    role = serializers.ChoiceField(choices=["clinician", "admin"], default="clinician")

    def validate(self, attrs):
        assessment: Assessment = self.context["assessment"]
        if attrs["role"] != "clinician":
            raise serializers.ValidationError("Only clinicians can update clinical review status.")
        if not is_valid_status_transition(assessment.status, attrs["status"]):
            allowed = sorted(ALLOWED_STATUS_TRANSITIONS.get(assessment.status, set()))
            raise serializers.ValidationError(
                {"status": f"Invalid transition from {assessment.status}. Allowed: {allowed or 'none'}."}
            )
        return attrs


class CreateReviewNoteSerializer(serializers.Serializer):
    content = serializers.CharField(min_length=5, trim_whitespace=True)
    author = serializers.CharField(max_length=160, default="Dr Example")
    role = serializers.ChoiceField(choices=["clinician", "admin"], default="clinician")

    def validate(self, attrs):
        if attrs["role"] != "clinician":
            raise serializers.ValidationError("Only clinicians can add clinical review notes.")
        return attrs
