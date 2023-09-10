# Generated by Django 4.0 on 2023-09-10 12:00

import core.utils.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assessors', '0003_alter_assessor_country_alter_assessor_email_and_more'),
        ('projects', '0003_alter_project_asana_id_alter_project_manager_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectWorkingHours',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('monday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='понедельник')),
                ('tuesday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='вторник')),
                ('wednesday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='среда')),
                ('thursday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='четверг')),
                ('friday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='пятница')),
                ('saturday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='суббота')),
                ('sunday', models.IntegerField(default=0, validators=[core.utils.validators.not_negative_value_validator, core.utils.validators.day_hours_validator], verbose_name='воскресенье')),
                ('assessor', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='assessors.assessor', verbose_name='исполнитель')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='projects.project', verbose_name='проект')),
            ],
            options={
                'verbose_name': 'рабочие часы',
                'verbose_name_plural': 'рабочие часы',
                'db_table': 'project_working_hours',
                'ordering': ['id'],
            },
        ),
    ]
