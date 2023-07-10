# Generated by Django 4.0 on 2023-06-07 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_manager_is_active_alter_manager_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='manager',
            old_name='full_name',
            new_name='first_name',
        ),
        migrations.AddField(
            model_name='manager',
            name='last_name',
            field=models.CharField(default='Test', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='manager',
            name='middle_name',
            field=models.CharField(default='Test', max_length=255),
            preserve_default=False,
        ),
    ]
