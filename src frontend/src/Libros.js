import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Grid, Paper, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';

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
      if (response.status === 200) {
        setLibros(response.data);
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
    <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Añadir un nuevo libro
        </Typography>
        <form onSubmit={handleCrearLibro}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Título"
                variant="outlined"
                fullWidth
                value={nuevoLibro.titulo}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Autor"
                variant="outlined"
                fullWidth
                value={nuevoLibro.autor}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, autor: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Categoría"
                variant="outlined"
                fullWidth
                value={nuevoLibro.categoria}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, categoria: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={nuevoLibro.estado}
                  onChange={(e) => setNuevoLibro({ ...nuevoLibro, estado: e.target.value })}
                >
                  <MenuItem value="disponible">Disponible</MenuItem>
                  <MenuItem value="prestado">Prestado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Ubicación"
                variant="outlined"
                fullWidth
                value={nuevoLibro.ubicacion}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, ubicacion: e.target.value })}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button type="submit" variant="contained" size="large">
              Añadir Libro
            </Button>
          </Box>
        </form>
      </Paper>

      <Paper sx={{ mt: 4, padding: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Lista de Libros
        </Typography>
        <Grid container spacing={2}>
          {libros.map((libro) => (
            <Grid item xs={12} md={4} key={libro.id}>
              <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <Typography variant="h6">{libro.titulo}</Typography>
                <Typography variant="body1">{libro.autor}</Typography>
                <Typography variant="body2">{libro.categoria}</Typography>
                <Typography variant="body2" color={libro.estado === 'disponible' ? 'green' : 'red'}>
                  {libro.estado}
                </Typography>
                <Typography variant="body2">{libro.ubicacion}</Typography>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button variant="outlined" color="error" onClick={() => handleEliminarLibro(libro.id)}>
                    Eliminar
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Libros;