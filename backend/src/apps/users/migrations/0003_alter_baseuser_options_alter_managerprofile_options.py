# Generated by Django 4.0 on 2023-09-08 15:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_remove_passwordresettoken_created_at_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='baseuser',
            options={'ordering': ['id'], 'verbose_name': 'пользователь', 'verbose_name_plural': 'пользователи'},
        ),
        migrations.AlterModelOptions(
            name='managerprofile',
            options={'ordering': ['id'], 'verbose_name': 'профиль менеджера', 'verbose_name_plural': 'профили менеджеров'},
        ),
    ]
