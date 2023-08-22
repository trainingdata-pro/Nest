# Generated by Django 4.0 on 2023-08-16 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessors', '0012_alter_assessor_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='assessor',
            name='free_resource_day_off_hours',
            field=models.CharField(blank=True, choices=[('0', '0'), ('2-4', '2-4'), ('4-6', '4-6'), ('6-8', '6-8')], max_length=5, null=True, verbose_name='ресурс работы в выходные дни, ч'),
        ),
        migrations.AddField(
            model_name='assessor',
            name='free_resource_weekday_hours',
            field=models.CharField(blank=True, choices=[('0', '0'), ('2-4', '2-4'), ('4-6', '4-6'), ('6-8', '6-8')], max_length=5, null=True, verbose_name='ресурс работы в рабочие дни, ч'),
        ),
        migrations.DeleteModel(
            name='FreeResourceSchedule',
        ),
    ]