from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Assessment, ReviewNote


class AssessmentApiTests(APITestCase):
    def setUp(self):
        self.assessment = Assessment.objects.create(
            candidate_name="Test Candidate",
            role_title="Test Role",
            employer_name="Test Employer",
            submitted_at=timezone.now(),
            risk_level=Assessment.RiskLevel.MEDIUM,
            status=Assessment.Status.NEW,
            clinician="Dr Example",
            flags=["Test flag"],
            summary="Test summary for API behavior.",
        )
        self.assessment_high = Assessment.objects.create(
            candidate_name="High Risk Candidate",
            role_title="Field Technician",
            employer_name="Northline Logistics",
            submitted_at=timezone.now(),
            risk_level=Assessment.RiskLevel.HIGH,
            status=Assessment.Status.IN_REVIEW,
            clinician="Dr Example",
            flags=["Manual handling"],
            summary="High risk sample.",
        )
        self.assessment_low = Assessment.objects.create(
            candidate_name="Low Risk Candidate",
            role_title="Admin Assistant",
            employer_name="Harbour Insurance",
            submitted_at=timezone.now(),
            risk_level=Assessment.RiskLevel.LOW,
            status=Assessment.Status.CLEARED,
            clinician="Dr Example",
            flags=[],
            summary="Low risk sample.",
        )

    def test_valid_status_transition_succeeds(self):
        response = self.client.post(
            f"/api/assessments/{self.assessment.id}/status/",
            {
                "status": Assessment.Status.IN_REVIEW,
                "actor": "Dr Example",
                "role": "clinician",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assessment.refresh_from_db()
        self.assertEqual(self.assessment.status, Assessment.Status.IN_REVIEW)

    def test_invalid_status_transition_fails(self):
        response = self.client.post(
            f"/api/assessments/{self.assessment.id}/status/",
            {
                "status": Assessment.Status.CLEARED,
                "actor": "Dr Example",
                "role": "clinician",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assessment.refresh_from_db()
        self.assertEqual(self.assessment.status, Assessment.Status.NEW)

    def test_valid_review_note_creates(self):
        response = self.client.post(
            f"/api/assessments/{self.assessment.id}/notes/",
            {
                "author": "Dr Example",
                "content": "Candidate requires follow-up checks.",
                "role": "clinician",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ReviewNote.objects.filter(assessment=self.assessment).count(), 1)

    def test_admin_cannot_create_review_note(self):
        response = self.client.post(
            f"/api/assessments/{self.assessment.id}/notes/",
            {
                "author": "Ops Admin",
                "content": "Should not be allowed",
                "role": "admin",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ReviewNote.objects.filter(assessment=self.assessment).count(), 0)

    def test_short_review_note_fails(self):
        response = self.client.post(
            f"/api/assessments/{self.assessment.id}/notes/",
            {
                "author": "Dr Example",
                "content": "bad",
                "role": "clinician",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ReviewNote.objects.filter(assessment=self.assessment).count(), 0)

    def test_assessment_list_returns_items(self):
        response = self.client.get("/api/assessments/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertIn("count", response.data)
        self.assertGreaterEqual(response.data["count"], 1)

    def test_list_pagination_honors_page_size(self):
        response = self.client.get("/api/assessments/?page_size=2")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_list_filter_search_and_sort(self):
        response = self.client.get(
            "/api/assessments/?risk_level=high&status=in_review&search=Northline&ordering=submitted_at"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], self.assessment_high.id)

    def test_admin_cannot_change_status(self):
        response = self.client.post(
            f"/api/assessments/{self.assessment.id}/status/",
            {
                "status": Assessment.Status.IN_REVIEW,
                "actor": "Ops Admin",
                "role": "admin",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assessment.refresh_from_db()
        self.assertEqual(self.assessment.status, Assessment.Status.NEW)
