# Generated by Django 4.0 on 2023-06-19 11:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('assessors', '0008_alter_assessor_date_of_registration_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='assessor',
            options={'verbose_name': 'исполнитель', 'verbose_name_plural': 'исполнители'},
        ),
    ]
