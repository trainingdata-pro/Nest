# Generated by Django 4.0 on 2023-10-06 10:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0009_alter_project_asana_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='status',
            field=models.CharField(choices=[('active', 'В работе'), ('pause', 'На паузе'), ('completed', 'Завершен')], max_length=10, verbose_name='статус проекта'),
        ),
    ]
