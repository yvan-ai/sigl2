# Generated by Django 4.2.17 on 2025-01-11 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('utilisateurs', '0009_notification_reminder'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='reminder',
            field=models.BooleanField(default=False),
        ),
    ]
