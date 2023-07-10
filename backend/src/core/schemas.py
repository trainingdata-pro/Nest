from dataclasses import dataclass
from typing import Dict, List

from drf_yasg.utils import swagger_auto_schema


@dataclass
class BaseAPISchema:
    tags: List

    def __post_init__(self):
        self.statuses = {
            204: self.get_204(),
            400: self.get_400(),
            401: self.get_401(),
            403: self.get_403(),
            404: self.get_404()
        }

    def retrieve(self):
        pass

    def list(self):
        pass

    def create(self):
        pass

    def partial_update(self):
        pass

    def destroy(self):
        pass

    def post(self):
        pass

    def swagger_auto_schema(self, *args, **kwargs):
        return swagger_auto_schema(tags=self.tags, *args, **kwargs)

    def get_responses(self, *statuses) -> Dict:
        responses = {}
        for status in statuses:
            responses.update(self.statuses[status]) if status in self.statuses else {}

        return responses

    @staticmethod
    def get_204() -> Dict:
        return {
            204: 'No content'
        }

    @staticmethod
    def get_400() -> Dict:
        return {
            400: 'Bed request'
        }

    @staticmethod
    def get_401() -> Dict:
        return {
            401: 'Unauthorized'
        }

    @staticmethod
    def get_403() -> Dict:
        return {
            403: 'Forbidden'
        }

    @staticmethod
    def get_404() -> Dict:
        return {
            404: 'Not found'
        }