# Generated by Django 4.0 on 2023-09-26 15:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fired', '0003_fired_date_to_return'),
    ]

    operations = [
        migrations.RenameField(
            model_name='fired',
            old_name='date_to_return',
            new_name='possible_return_date',
        ),
    ]
