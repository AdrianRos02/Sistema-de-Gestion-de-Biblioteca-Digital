# Generated by Django 5.1.3 on 2024-12-18 17:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('biblioteca', '0003_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='libro',
            name='descripcion',
        ),
        migrations.RemoveField(
            model_name='libro',
            name='disponible',
        ),
        migrations.RemoveField(
            model_name='libro',
            name='fecha_publicacion',
        ),
        migrations.RemoveField(
            model_name='libro',
            name='isbn',
        ),
        migrations.RemoveField(
            model_name='libro',
            name='usuario',
        ),
        migrations.AddField(
            model_name='libro',
            name='estado',
            field=models.CharField(choices=[('disponible', 'Disponible'), ('prestado', 'Prestado')], default='disponible', max_length=10),
        ),
        migrations.AddField(
            model_name='libro',
            name='ubicacion',
            field=models.CharField(default='Desconocida', max_length=100),
        ),
        migrations.AlterField(
            model_name='libro',
            name='autor',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='libro',
            name='categoria',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='libro',
            name='titulo',
            field=models.CharField(max_length=100),
        ),
    ]
