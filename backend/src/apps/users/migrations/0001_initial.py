# Generated by Django 4.0 on 2023-09-08 20:04

import apps.users.utils
import core.validators
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='BaseUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('last_name', models.CharField(blank=True, max_length=255, validators=[core.validators.allowed_chars_validator], verbose_name='фамилия')),
                ('first_name', models.CharField(blank=True, max_length=255, validators=[core.validators.allowed_chars_validator], verbose_name='имя')),
                ('middle_name', models.CharField(blank=True, max_length=255, validators=[core.validators.allowed_chars_validator], verbose_name='отчество')),
                ('email', models.EmailField(db_index=True, max_length=254, unique=True, validators=[core.validators.email_domain_validator], verbose_name='email')),
                ('status', models.CharField(choices=[('admin', 'Администратор'), ('manager', 'Менеджер')], max_length=10, verbose_name='статус')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'пользователь',
                'verbose_name_plural': 'пользователи',
                'db_table': 'users',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PasswordResetToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('expiration_time', models.DateTimeField(default=apps.authapp.utils.create_expiration_date)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.baseuser')),
            ],
        ),
        migrations.CreateModel(
            name='ManagerProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_teamlead', models.BooleanField(default=False, verbose_name='teamlead')),
                ('teamlead', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='users.baseuser', validators=[core.validators.only_manager_validator], verbose_name='руководитель')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='manager_profile', to='users.baseuser')),
            ],
            options={
                'verbose_name': 'профиль менеджера',
                'verbose_name_plural': 'профили менеджеров',
                'db_table': 'manager profiles',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Code',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=20, unique=True, verbose_name='код')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='code', to='users.baseuser')),
            ],
            options={
                'verbose_name': 'код подтверждения',
                'verbose_name_plural': 'коды подтверждения',
                'db_table': 'codes',
            },
        ),
    ]
