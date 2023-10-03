# Generated by Django 4.0 on 2023-09-08 20:04

import core.validators
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('assessors', '0001_initial'),
        ('users', '0001_initial'),
        ('projects', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='assessor',
            name='manager',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='assessors', to='users.baseuser', validators=[core.validators.only_manager_validator], verbose_name='менеджер'),
        ),
        migrations.AddField(
            model_name='assessor',
            name='projects',
            field=models.ManyToManyField(blank=True, related_name='assessors', to='projects.Project', verbose_name='проекты'),
        ),
        migrations.AddField(
            model_name='assessor',
            name='second_manager',
            field=models.ManyToManyField(blank=True, related_name='extra', to=settings.AUTH_USER_MODEL, verbose_name='доп. менеджеры'),
        ),
        migrations.AddField(
            model_name='assessor',
            name='skills',
            field=models.ManyToManyField(blank=True, to='assessors.Skill', verbose_name='навыки'),
        ),
    ]
