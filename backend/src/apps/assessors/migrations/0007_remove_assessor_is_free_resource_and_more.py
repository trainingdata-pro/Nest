# Generated by Django 4.0 on 2023-09-14 16:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessors', '0006_assessor_vacation_date_alter_assessor_state'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='assessor',
            name='is_free_resource',
        ),
        migrations.AlterField(
            model_name='assessor',
            name='state',
            field=models.CharField(choices=[('available', 'Доступен'), ('busy', 'Занят'), ('free_resource', 'Свободный ресурс'), ('vacation', 'Отпуск'), ('blacklist', 'Черный список'), ('fired', 'Уволен')], max_length=15, verbose_name='состояние'),
        ),
    ]
