# Generated by Django 4.0 on 2023-09-08 20:04

import apps.assessors.utils.validators
import core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assessor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(error_messages={'unique': 'Исполнитель с таким именем пользователя уже существует.'}, max_length=150, unique=True, validators=[
                    apps.assessors.utils.validators.assessor_username_validator], verbose_name='имя пользователя')),
                ('last_name', models.CharField(max_length=255, validators=[core.validators.allowed_chars_validator], verbose_name='фамилия')),
                ('first_name', models.CharField(max_length=255, validators=[core.validators.allowed_chars_validator], verbose_name='имя')),
                ('middle_name', models.CharField(max_length=255, validators=[core.validators.allowed_chars_validator], verbose_name='отчество')),
                ('email', models.EmailField(max_length=254, unique=True, validators=[
                    apps.assessors.utils.validators.assessor_email_validator], verbose_name='эл. почта')),
                ('country', models.CharField(max_length=255, verbose_name='страна')),
                ('status', models.CharField(choices=[('full', 'Полная загрузка'), ('partial', 'Частичная загрузка'), ('free', 'Свободен')], default='free', max_length=10, verbose_name='статус')),
                ('is_free_resource', models.BooleanField(default=False, verbose_name='св. ресурс')),
                ('free_resource_weekday_hours', models.CharField(blank=True, choices=[('0', '0'), ('2-4', '2-4'), ('4-6', '4-6'), ('6-8', '6-8')], max_length=5, null=True, verbose_name='ресурс работы в рабочие дни, ч')),
                ('free_resource_day_off_hours', models.CharField(blank=True, choices=[('0', '0'), ('2-4', '2-4'), ('4-6', '4-6'), ('6-8', '6-8')], max_length=5, null=True, verbose_name='ресурс работы в выходные дни, ч')),
                ('state', models.CharField(choices=[('work', 'Работает'), ('blacklist', 'Черный список'), ('fired', 'Уволен по собственному желанию')], default='work', max_length=10, verbose_name='состояние')),
                ('date_of_registration', models.DateField(auto_now_add=True, verbose_name='дата регистрации')),
            ],
            options={
                'verbose_name': 'исполнитель',
                'verbose_name_plural': 'исполнители',
                'db_table': 'assessors',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150, unique=True, verbose_name='название')),
            ],
            options={
                'verbose_name': 'навык',
                'verbose_name_plural': 'навыки',
                'db_table': 'skills',
                'ordering': ['id'],
            },
        ),
    ]
