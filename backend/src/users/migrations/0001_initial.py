# Generated by Django 4.0 on 2023-07-21 12:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Manager',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_name', models.CharField(blank=True, max_length=255, verbose_name='фамилия')),
                ('first_name', models.CharField(blank=True, max_length=255, verbose_name='имя')),
                ('middle_name', models.CharField(blank=True, max_length=255, verbose_name='отчество')),
                ('is_operational_manager', models.BooleanField(default=False, verbose_name='операционный менеджер')),
                ('operational_manager', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='users.manager', verbose_name='руководитель')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='manager', to='auth.user')),
            ],
            options={
                'verbose_name': 'менеджер',
                'verbose_name_plural': 'менеджеры',
                'db_table': 'managers',
            },
        ),
        migrations.CreateModel(
            name='Code',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=20, unique=True, verbose_name='код')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='code', to='auth.user')),
            ],
            options={
                'verbose_name': 'код подтверждения',
                'verbose_name_plural': 'коды подтверждения',
                'db_table': 'codes',
            },
        ),
    ]
