# Generated by Django 4.0 on 2023-09-25 16:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('history', '0002_alter_history_event'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='history',
            name='description',
        ),
        migrations.RemoveField(
            model_name='history',
            name='event',
        ),
        migrations.AddField(
            model_name='history',
            name='action',
            field=models.CharField(choices=[('created', 'Добавлен в систему'), ('to_team', 'Забрать в команду'), ('rent', 'Арендовать'), ('add_project', 'Добавить проект'), ('remove_project', 'Удалить с проекта'), ('complete_project', 'Завершить проект'), ('left', 'Уволить'), ('unpin', 'Открепить от себя'), ('add_to_free_resource', 'Отправить в свободные ресурсы'), ('remove_from_free_resource', 'Вернуть из свободных ресурсов'), ('to_vacation', 'Отправить в отпуск'), ('from_vacation', 'Вернуть из отпуска')], max_length=100, null=True, verbose_name='действие'),
        ),
        migrations.AddField(
            model_name='history',
            name='attribute',
            field=models.CharField(choices=[('full_name', 'ФИО'), ('username', 'Никнейм в Telegram'), ('manager', 'Руководитель'), ('project', 'Проект'), ('state', 'Состояние')], default='state', max_length=10, verbose_name='атрибут'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='history',
            name='new_value',
            field=models.TextField(null=True, verbose_name='новое значение'),
        ),
        migrations.AddField(
            model_name='history',
            name='old_value',
            field=models.TextField(null=True, verbose_name='старое значение'),
        ),
        migrations.AddField(
            model_name='history',
            name='reason',
            field=models.TextField(null=True, verbose_name='причина'),
        ),
        migrations.AddField(
            model_name='history',
            name='user',
            field=models.CharField(default='default', max_length=155, verbose_name='пользователь'),
            preserve_default=False,
        ),
    ]
