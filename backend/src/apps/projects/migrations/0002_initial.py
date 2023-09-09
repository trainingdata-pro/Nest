# Generated by Django 4.0 on 2023-09-08 20:04

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('projects', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='manager',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL, verbose_name='менеджеры'),
        ),
        migrations.AddField(
            model_name='project',
            name='tag',
            field=models.ManyToManyField(to='projects.ProjectTag', verbose_name='тег'),
        ),
    ]
