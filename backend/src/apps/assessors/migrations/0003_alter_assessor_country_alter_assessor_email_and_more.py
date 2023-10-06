# Generated by Django 4.0 on 2023-09-09 15:26

import apps.assessors.utils.validators
import core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessors', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assessor',
            name='country',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='страна'),
        ),
        migrations.AlterField(
            model_name='assessor',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True, unique=True, validators=[
                apps.assessors.utils.validators.assessor_email_validator], verbose_name='эл. почта'),
        ),
        migrations.AlterField(
            model_name='assessor',
            name='middle_name',
            field=models.CharField(blank=True, max_length=255, null=True, validators=[core.validators.allowed_chars_validator], verbose_name='отчество'),
        ),
        migrations.AlterField(
            model_name='assessor',
            name='status',
            field=models.CharField(blank=True, choices=[('full', 'Полная загрузка'), ('partial', 'Частичная загрузка'), ('reserved', 'Зарезервирован')], max_length=10, null=True, verbose_name='статус'),
        ),
    ]
