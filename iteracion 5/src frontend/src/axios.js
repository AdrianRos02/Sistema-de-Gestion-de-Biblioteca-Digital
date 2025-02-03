import axios from 'axios';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',  // Asegúrate de que esta URL sea correcta
  headers: {
    'Content-Type': 'application/json',
    // Puedes agregar más configuraciones si es necesario
  }
});

export const crearPrestamo = (libroNombre, usuarioNombre) => {
  return api.post('prestamos/', {
    libro_nombre: libroNombre,  // Nombre del libro
    usuario_nombre: usuarioNombre  // Nombre del usuario
  });
};

export default api;

