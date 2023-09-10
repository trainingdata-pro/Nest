# Generated by Django 4.0 on 2023-09-08 20:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('assessors', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlackListReason',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='причина')),
            ],
            options={
                'verbose_name': 'причина добавления в ЧС',
                'verbose_name_plural': 'причины добавления в ЧС',
                'db_table': 'blacklist_reasons',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='FiredReason',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='причина')),
            ],
            options={
                'verbose_name': 'причина увольнения',
                'verbose_name_plural': 'причины увольнения',
                'db_table': 'fired_reasons',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Fired',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True, verbose_name='дата')),
                ('assessor', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='assessors.assessor', verbose_name='исполнитель')),
                ('reason', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='fired.firedreason', verbose_name='причина')),
            ],
            options={
                'verbose_name': 'уволенный',
                'verbose_name_plural': 'уволенные',
                'db_table': 'fired',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='BlackList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True, verbose_name='дата')),
                ('assessor', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='assessors.assessor', verbose_name='исполнитель')),
                ('reason', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='fired.blacklistreason', verbose_name='причина')),
            ],
            options={
                'verbose_name': 'черный список',
                'verbose_name_plural': 'черный список',
                'db_table': 'blacklist',
                'ordering': ['id'],
            },
        ),
    ]
