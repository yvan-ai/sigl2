# Generated by Django 4.2.17 on 2024-12-27 22:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('utilisateurs', '0002_event'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='apprenti',
            name='numero_journal',
        ),
        migrations.AddField(
            model_name='apprenti',
            name='numero_journal',
            field=models.ManyToManyField(blank=True, null=True, to='utilisateurs.journaldeformation'),
        ),
    ]
