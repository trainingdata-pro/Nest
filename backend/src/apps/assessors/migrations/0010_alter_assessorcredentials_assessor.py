# Generated by Django 4.0 on 2023-11-21 12:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assessors', '0009_remove_assessor_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assessorcredentials',
            name='assessor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='assessors.assessor', verbose_name='исполнитель'),
        ),
    ]
