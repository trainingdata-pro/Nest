# Generated by Django 4.0 on 2023-08-22 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        ('assessors', '0013_assessor_free_resource_day_off_hours_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='assessor',
            name='blacklist',
        ),
        migrations.AddField(
            model_name='assessor',
            name='state',
            field=models.CharField(choices=[('work', 'Работает'), ('blacklist', 'Черный список'), ('left', 'Уволен по собственному желанию')], default='work', max_length=10, verbose_name='состояние'),
        ),
        migrations.AlterField(
            model_name='assessor',
            name='second_manager',
            field=models.ManyToManyField(blank=True, related_name='extra', to='users.Manager', verbose_name='доп. менеджеры'),
        ),
    ]