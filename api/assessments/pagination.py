from rest_framework.pagination import PageNumberPagination


class AssessmentPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = "page_size"
    max_page_size = 100
