api.get('usuarios/')
    .then(response => {
        setUsuarios(response.data);
    })
    .catch(error => {
        if (error.response) {
            // La solicitud fue hecha y el servidor respondió con un código de estado
            console.error("Respuesta del servidor:", error.response.data);
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error("No se recibió respuesta:", error.request);
        } else {
            // Algo sucedió al configurar la solicitud
            console.error("Error al configurar la solicitud:", error.message);
        }
    });