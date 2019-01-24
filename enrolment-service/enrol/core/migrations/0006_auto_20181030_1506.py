# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2018-10-30 15:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_auto_20171128_1617'),
    ]

    operations = [
        migrations.AddField(
            model_name='applications',
            name='institution_website',
            field=models.URLField(null=True),
        ),
        migrations.AlterField(
            model_name='projects',
            name='status',
            field=models.IntegerField(choices=[(0, 'Pending'), (1, 'Approved'), (2, 'Denied'), (3, 'Termination Requested'), (4, 'Terminated')], default=0),
        ),
        migrations.AlterField(
            model_name='projectusers',
            name='status',
            field=models.IntegerField(choices=[(0, 'Invited'), (1, 'Pending'), (2, 'Active'), (3, 'Project Termination Requested'), (4, 'Project Terminated')], default=0),
        ),
    ]