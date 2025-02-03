// src/api/apiClient.js

import axios from 'axios';

// Aquí debes especificar la URL base de tu backend Django
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/',  // Cambia esto si tu backend está en otro puerto o URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;