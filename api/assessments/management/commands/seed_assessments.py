from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from assessments.models import Assessment, AuditEvent, ReviewNote


class Command(BaseCommand):
    help = "Seed sample Medrisk assessment data"

    def handle(self, *args, **options):
        ReviewNote.objects.all().delete()
        AuditEvent.objects.all().delete()
        Assessment.objects.all().delete()

        now = timezone.now()
        employers = [
            "Northline Logistics",
            "Southern Foods Group",
            "MetroCare Services",
            "GridWorks Australia",
            "CareBridge Health",
            "Harbour Insurance",
            "RedRidge Minerals",
            "CityTransit NSW",
            "BioSure Diagnostics",
            "Summit Civil Pty Ltd",
        ]
        roles = [
            "Warehouse Forklift Operator",
            "Night Shift Production Worker",
            "Customer Support Officer",
            "Field Technician",
            "Aged Care Support Worker",
            "Administration Assistant",
            "Mining Site Supervisor",
            "Bus Driver",
            "Laboratory Technician",
            "Construction Rigger",
        ]
        clinicians = ["Dr Mei Chen", "Dr Sarah Patel", "Dr Omar Ali", "Dr Priya Nair", ""]
        risks = [Assessment.RiskLevel.LOW, Assessment.RiskLevel.MEDIUM, Assessment.RiskLevel.HIGH]
        statuses = [
            Assessment.Status.NEW,
            Assessment.Status.IN_REVIEW,
            Assessment.Status.REQUIRES_FOLLOW_UP,
            Assessment.Status.CLEARED,
            Assessment.Status.NOT_CLEARED,
        ]

        seeded_count = 1000
        note_count = 0
        audit_count = 0

        for index in range(seeded_count):
            status = statuses[index % len(statuses)]
            risk_level = risks[(index // len(statuses)) % len(risks)]
            clinician = clinicians[index % len(clinicians)] if status != Assessment.Status.NEW else ""

            flags = []
            if risk_level == Assessment.RiskLevel.HIGH:
                flags = ["High physical demand", "Condition disclosure", "Safety critical role"]
            elif risk_level == Assessment.RiskLevel.MEDIUM:
                flags = ["Fatigue risk", "Manual handling"]
            elif index % 4 == 0:
                flags = ["Incomplete response"]

            assessment = Assessment.objects.create(
                candidate_name=f"Candidate {index + 1}",
                role_title=roles[index % len(roles)],
                employer_name=employers[index % len(employers)],
                submitted_at=now - timedelta(hours=index),
                risk_level=risk_level,
                status=status,
                clinician=clinician,
                flags=flags,
                summary=(
                    "Auto-generated seed assessment for dashboard, filtering, status workflow, and pagination tasks."
                ),
            )

            AuditEvent.objects.create(
                assessment=assessment,
                action="assessment_submitted",
                actor="system",
                new_status=Assessment.Status.NEW,
            )
            audit_count += 1

            if status != Assessment.Status.NEW:
                AuditEvent.objects.create(
                    assessment=assessment,
                    action="status_changed",
                    actor=clinician or "system",
                    previous_status=Assessment.Status.NEW,
                    new_status=status,
                )
                audit_count += 1

            if status in {Assessment.Status.IN_REVIEW, Assessment.Status.REQUIRES_FOLLOW_UP} or index % 10 == 0:
                ReviewNote.objects.create(
                    assessment=assessment,
                    author=clinician or "Dr Example",
                    content="Initial clinical note captured for seeded case review.",
                )
                AuditEvent.objects.create(
                    assessment=assessment,
                    action="review_note_added",
                    actor=clinician or "Dr Example",
                )
                note_count += 1
                audit_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {seeded_count} assessments, {note_count} notes, and {audit_count} audit events."
            )
        )
