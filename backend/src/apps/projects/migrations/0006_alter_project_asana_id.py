# Generated by Django 4.0 on 2023-09-11 16:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_alter_projectworkinghours_assessor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='asana_id',
            field=models.BigIntegerField(unique=True, verbose_name='asana ID'),
        ),
    ]
