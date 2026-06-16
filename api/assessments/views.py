from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Assessment, AuditEvent, ReviewNote
from .pagination import AssessmentPagination
from .serializers import (
    AssessmentDetailSerializer,
    AssessmentListSerializer,
    CreateReviewNoteSerializer,
    ReviewNoteSerializer,
    StatusUpdateSerializer,
)


class AssessmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Assessment.objects.prefetch_related("notes", "audit_events").all()
    pagination_class = AssessmentPagination

    def get_serializer_class(self):
        if self.action == "retrieve":
            return AssessmentDetailSerializer
        return AssessmentListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        risk_level = self.request.query_params.get("risk_level")
        status_value = self.request.query_params.get("status")
        search = self.request.query_params.get("search")
        ordering = self.request.query_params.get("ordering", "-submitted_at")

        if risk_level:
            queryset = queryset.filter(risk_level=risk_level)
        if status_value:
            queryset = queryset.filter(status=status_value)
        if search:
            queryset = queryset.filter(
                Q(candidate_name__icontains=search)
                | Q(employer_name__icontains=search)
                | Q(role_title__icontains=search)
            )

        if ordering in {"submitted_at", "-submitted_at", "risk_level", "status"}:
            queryset = queryset.order_by(ordering)

        return queryset

    @action(detail=True, methods=["post"], url_path="status")
    def update_status(self, request, pk=None):
        assessment = self.get_object()
        serializer = StatusUpdateSerializer(data=request.data, context={"assessment": assessment})
        serializer.is_valid(raise_exception=True)

        previous_status = assessment.status
        assessment.status = serializer.validated_data["status"]
        assessment.save(update_fields=["status", "updated_at"])

        AuditEvent.objects.create(
            assessment=assessment,
            action="status_changed",
            actor=serializer.validated_data["actor"],
            previous_status=previous_status,
            new_status=assessment.status,
        )

        return Response(AssessmentDetailSerializer(assessment).data)

    @action(detail=True, methods=["post"], url_path="notes")
    def create_note(self, request, pk=None):
        assessment = self.get_object()
        serializer = CreateReviewNoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        note = ReviewNote.objects.create(
            assessment=assessment,
            author=serializer.validated_data["author"],
            content=serializer.validated_data["content"],
        )
        AuditEvent.objects.create(
            assessment=assessment,
            action="review_note_added",
            actor=serializer.validated_data["author"],
        )

        return Response(ReviewNoteSerializer(note).data, status=status.HTTP_201_CREATED)
