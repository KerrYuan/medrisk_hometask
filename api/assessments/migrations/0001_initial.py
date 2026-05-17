# Generated for Medrisk home task starter
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Assessment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("candidate_name", models.CharField(max_length=160)),
                ("role_title", models.CharField(max_length=160)),
                ("employer_name", models.CharField(max_length=160)),
                ("submitted_at", models.DateTimeField()),
                ("risk_level", models.CharField(choices=[("low", "Low"), ("medium", "Medium"), ("high", "High")], max_length=20)),
                ("status", models.CharField(choices=[("new", "New"), ("in_review", "In review"), ("requires_follow_up", "Requires follow-up"), ("cleared", "Cleared"), ("not_cleared", "Not cleared")], default="new", max_length=30)),
                ("clinician", models.CharField(blank=True, max_length=160)),
                ("flags", models.JSONField(blank=True, default=list)),
                ("summary", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-submitted_at"]},
        ),
        migrations.CreateModel(
            name="AuditEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("action", models.CharField(max_length=120)),
                ("actor", models.CharField(max_length=160)),
                ("previous_status", models.CharField(blank=True, max_length=30)),
                ("new_status", models.CharField(blank=True, max_length=30)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("assessment", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="audit_events", to="assessments.assessment")),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="ReviewNote",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("author", models.CharField(max_length=160)),
                ("content", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("assessment", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="notes", to="assessments.assessment")),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
