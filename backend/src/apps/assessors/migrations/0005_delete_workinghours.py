# Generated by Django 4.0 on 2023-09-08 16:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('assessors', '0004_alter_assessor_first_name_alter_assessor_last_name_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='WorkingHours',
        ),
    ]
