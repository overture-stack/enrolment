# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-28 16:15
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20171128_1516'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userrequest',
            name='project',
        ),
        migrations.AlterField(
            model_name='projectusers',
            name='agreementDate',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.DeleteModel(
            name='UserRequest',
        ),
    ]
