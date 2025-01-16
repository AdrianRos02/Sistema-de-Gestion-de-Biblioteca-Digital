import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    // Obtener las notificaciones
    axios.get('/api/notificaciones/')
      .then(response => setNotificaciones(response.data))
      .catch(error => console.log(error));

    // Obtener los préstamos con sanciones
    axios.get('/api/prestamos/')
      .then(response => setPrestamos(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <h2>Notificaciones</h2>
      <ul>
        {notificaciones.map(notificacion => (
          <li key={notificacion.id}>
            {notificacion.mensaje} - {notificacion.fecha_creacion}
          </li>
        ))}
      </ul>

      <h2>Préstamos y Sanciones</h2>
      <ul>
        {prestamos.map(prestamo => (
          <li key={prestamo.id}>
            Libro: {prestamo.libro} - Sanción acumulada: {prestamo.sancion_acumulada}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notificaciones;