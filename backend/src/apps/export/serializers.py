from rest_framework import serializers


class ExportSerializer(serializers.Serializer):
    task_id = serializers.CharField(required=False, max_length=255)


class DownloadStatusSerializer(serializers.Serializer):
    status = serializers.CharField(max_length=50, required=False)
    filename = serializers.CharField(max_length=50, allow_null=True, required=False)
