# Generated by Django 4.0 on 2023-07-24 14:16

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
                ('username', models.CharField(error_messages={'unique': 'Исполнитель с таким именем пользователя уже существует.'}, max_length=150, unique=True, verbose_name='имя пользователя')),
                ('last_name', models.CharField(max_length=255, verbose_name='фамилия')),
                ('first_name', models.CharField(max_length=255, verbose_name='имя')),
                ('middle_name', models.CharField(max_length=255, verbose_name='отчество')),
                ('is_busy', models.BooleanField(default=False, verbose_name='занят')),
                ('date_of_registration', models.DateField(auto_now_add=True, verbose_name='дата регистрации')),
            ],
            options={
                'verbose_name': 'исполнитель',
                'verbose_name_plural': 'исполнители',
                'db_table': 'assessors',
            },
        ),
    ]