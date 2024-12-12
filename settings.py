DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # Motor de base de datos PostgreSQL
        'NAME': 'BibliotecaDigital_db',             # Nombre de tu base de datos
        'USER': 'adrian',                           # Usuario de la base de datos
        'PASSWORD': 'surf12',            # Contraseña del usuario
        'HOST': 'localhost',                        # Dirección del servidor (localhost para local)
        'PORT': '5432',                             # Puerto predeterminado de PostgreSQL
    }
}