from .models import Assessment

ALLOWED_STATUS_TRANSITIONS: dict[str, set[str]] = {
    Assessment.Status.NEW: {Assessment.Status.IN_REVIEW},
    Assessment.Status.IN_REVIEW: {
        Assessment.Status.REQUIRES_FOLLOW_UP,
        Assessment.Status.CLEARED,
        Assessment.Status.NOT_CLEARED,
    },
    Assessment.Status.REQUIRES_FOLLOW_UP: {Assessment.Status.IN_REVIEW},
    Assessment.Status.CLEARED: set(),
    Assessment.Status.NOT_CLEARED: set(),
}


def is_valid_status_transition(current_status: str, next_status: str) -> bool:
    return next_status in ALLOWED_STATUS_TRANSITIONS.get(current_status, set())
