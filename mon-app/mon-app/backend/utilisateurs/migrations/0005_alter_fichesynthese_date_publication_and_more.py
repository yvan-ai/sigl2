# Generated by Django 4.2.17 on 2024-12-29 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('utilisateurs', '0004_event_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fichesynthese',
            name='date_publication',
            field=models.DateField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='presentation',
            name='date_publication',
            field=models.DateField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='rapportfinal',
            name='date_publication',
            field=models.DateField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='rapportping',
            name='date_publication',
            field=models.DateField(auto_now=True),
        ),
    ]
