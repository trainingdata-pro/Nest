# Generated by Django 4.0 on 2023-07-27 11:12

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0004_alter_project_date_of_creation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='date_of_creation',
            field=models.DateField(default=datetime.datetime(2023, 7, 27, 11, 12, 18, 216873, tzinfo=utc), verbose_name='дата старта'),
        ),
    ]
