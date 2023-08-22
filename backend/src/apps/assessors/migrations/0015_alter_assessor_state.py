# Generated by Django 4.0 on 2023-08-22 11:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessors', '0014_remove_assessor_blacklist_assessor_state_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assessor',
            name='state',
            field=models.CharField(choices=[('work', 'Работает'), ('blacklist', 'Черный список'), ('fired', 'Уволен по собственному желанию')], default='work', max_length=10, verbose_name='состояние'),
        ),
    ]