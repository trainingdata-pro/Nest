# Generated by Django 4.0 on 2023-08-15 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assessors', '0011_alter_assessor_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assessor',
            name='email',
            field=models.EmailField(max_length=254, unique=True, verbose_name='эл. почта'),
        ),
    ]