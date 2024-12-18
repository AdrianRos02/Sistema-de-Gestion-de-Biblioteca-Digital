import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [nuevoLibro, setNuevoLibro] = useState({
    titulo: '',
    autor: '',
    categoria: '',
    estado: 'disponible',
    ubicacion: ''
  });

  // Obtener libros al cargar el componente
  useEffect(() => {
    fetchLibros();
  }, []);

  // Función para obtener los libros
  const fetchLibros = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/libros/');
      console.log('Respuesta de API:', response);  // Verifica la respuesta completa
      if (response.status === 200) {
        setLibros(response.data);  // Asegúrate de que la respuesta contenga los datos esperados
      } else {
        console.error('Error en la respuesta de la API:', response.status);
      }
    } catch (error) {
      console.error('Error al obtener los libros', error);
    }
  };

  // Función para crear un nuevo libro
  const handleCrearLibro = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/libros/', nuevoLibro);
      fetchLibros();  // Actualizar la lista de libros
      setNuevoLibro({
        titulo: '',
        autor: '',
        categoria: '',
        estado: 'disponible',
        ubicacion: ''
      });
    } catch (error) {
      console.error('Error al crear el libro', error);
    }
  };

  // Función para eliminar un libro
  const handleEliminarLibro = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/libros/${id}/`);
      fetchLibros();  // Actualizar la lista de libros
    } catch (error) {
      console.error('Error al eliminar el libro', error);
    }
  };

  return (
    <div>
      <h1>Libros en la Biblioteca</h1>

      <form onSubmit={handleCrearLibro}>
        <h2>Añadir un nuevo libro</h2>
        <input
          type="text"
          placeholder="Título"
          value={nuevoLibro.titulo}
          onChange={(e) => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })}
        />
        <input
          type="text"
          placeholder="Autor"
          value={nuevoLibro.autor}
          onChange={(e) => setNuevoLibro({ ...nuevoLibro, autor: e.target.value })}
        />
        <input
          type="text"
          placeholder="Categoría"
          value={nuevoLibro.categoria}
          onChange={(e) => setNuevoLibro({ ...nuevoLibro, categoria: e.target.value })}
        />
        <select
          value={nuevoLibro.estado}
          onChange={(e) => setNuevoLibro({ ...nuevoLibro, estado: e.target.value })}
        >
          <option value="disponible">Disponible</option>
          <option value="prestado">Prestado</option>
        </select>
        <input
          type="text"
          placeholder="Ubicación"
          value={nuevoLibro.ubicacion}
          onChange={(e) => setNuevoLibro({ ...nuevoLibro, ubicacion: e.target.value })}
        />
        <button type="submit">Añadir Libro</button>
      </form>

      <h2>Lista de Libros</h2>
      <ul>
        {libros.map((libro) => (
          <li key={libro.id}>
            <strong>{libro.titulo}</strong> - {libro.autor} ({libro.categoria}) - Estado: {libro.estado} - Ubicación: {libro.ubicacion}
            <button onClick={() => handleEliminarLibro(libro.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Libros;