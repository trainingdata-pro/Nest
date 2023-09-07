# Generated by Django 4.0 on 2023-09-07 15:50

import apps.assessors.validators
import core.utils.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assessor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(error_messages={'unique': 'Исполнитель с таким именем пользователя уже существует.'}, max_length=150, unique=True, validators=[apps.assessors.validators.assessor_username_validator], verbose_name='имя пользователя')),
                ('last_name', models.CharField(max_length=255, verbose_name='фамилия')),
                ('first_name', models.CharField(max_length=255, verbose_name='имя')),
                ('middle_name', models.CharField(max_length=255, verbose_name='отчество')),
                ('email', models.EmailField(max_length=254, unique=True, validators=[apps.assessors.validators.assessor_email_validator], verbose_name='эл. почта')),
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
            },
        ),
        migrations.CreateModel(
            name='WorkingHours',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('monday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='понедельник')),
                ('tuesday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='вторник')),
                ('wednesday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='среда')),
                ('thursday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='четверг')),
                ('friday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='пятница')),
                ('saturday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='суббота')),
                ('sunday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='воскресенье')),
                ('assessor', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='assessors.assessor', verbose_name='исполнитель')),
            ],
            options={
                'verbose_name': 'рабочие часы',
                'verbose_name_plural': 'рабочие часы',
                'db_table': 'working_hours',
            },
        ),
    ]
