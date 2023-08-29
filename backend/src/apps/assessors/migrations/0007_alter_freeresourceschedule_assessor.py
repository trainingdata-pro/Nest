# Generated by Django 4.0 on 2023-07-25 14:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assessors', '0006_remove_assessor_capacity_freeresourceschedule'),
    ]

    operations = [
        migrations.AlterField(
            model_name='freeresourceschedule',
            name='assessor',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='fr_schedule', to='assessors.assessor', verbose_name='исполнитель'),
        ),
    ]
