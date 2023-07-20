# Generated by Django 4.0 on 2023-07-20 16:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_alter_code_code_alter_manager_first_name_and_more'),
        ('assessors', '0012_assessor_blacklist'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assessor',
            name='manager',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='assessor', to='users.manager', verbose_name='менеджер'),
        ),
    ]
