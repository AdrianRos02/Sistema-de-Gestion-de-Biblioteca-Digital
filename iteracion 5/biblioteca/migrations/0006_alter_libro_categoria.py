# Generated by Django 5.1.3 on 2025-02-02 22:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('biblioteca', '0005_alter_libro_categoria'),
    ]

    operations = [
        migrations.AlterField(
            model_name='libro',
            name='categoria',
            field=models.CharField(default='General', max_length=100),
        ),
    ]
