# Generated by Django 4.0 on 2023-09-07 12:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0013_project_date_of_completion'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='asana_id',
            field=models.BigIntegerField(null=True, unique=True, verbose_name='asana ID'),
        ),
    ]
