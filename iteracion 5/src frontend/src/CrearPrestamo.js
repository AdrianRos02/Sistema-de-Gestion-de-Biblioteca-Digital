import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const CrearPrestamo = () => {
    const [usuarioId, setUsuarioId] = useState('');
    const [libroId, setLibroId] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [libros, setLibros] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Obtener usuarios y libros desde la API
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/usuarios-libros/')
            .then(response => {
                console.log("Usuarios recibidos:", response.data.usuarios);  // 🔍 Ver qué devuelve la API
                setUsuarios(response.data.usuarios);
                setLibros(response.data.libros);
            })
            .catch(error => console.error('Error al obtener usuarios y libros:', error));
    }, []);

    const handleCrearPrestamo = async () => {
        if (!usuarioId || !libroId) {
            alert('Por favor seleccione un usuario y un libro');
            return;
        }
    
        setCargando(true);
        try {
            // Realiza la solicitud para crear el préstamo con todos los campos requeridos
            await axios.post('http://127.0.0.1:8000/api/prestamos/', {
                usuario: usuarioId,
                libro: libroId,
                estado: 'prestado',
                fecha_prestamo: new Date().toISOString(), // Asegúrate de enviar las fechas correctamente
                fecha_devolucion: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), // Ejemplo de fecha de devolución
            });
            alert('Préstamo creado con éxito');
            setUsuarioId('');
            setLibroId('');
        } catch (error) {
            console.error('Error al crear el préstamo:', error);
            alert('Error al crear el préstamo');
        } finally {
            setCargando(false);
        }
    };
    
  

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Crear Préstamo
                </Typography>

                {/* Lista desplegable de usuarios */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Usuario</InputLabel>
                    <Select
                        value={usuarioId}
                        onChange={(e) => setUsuarioId(e.target.value)}
                        label="Usuario"
                        required
                    >
                        {usuarios.map(usuario => (
                            <MenuItem key={usuario.id} value={usuario.id}>
                                {usuario.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Lista desplegable de libros */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Libro</InputLabel>
                    <Select
                        value={libroId}
                        onChange={(e) => setLibroId(e.target.value)}
                        label="Libro"
                        required
                    >
                        {libros.map(libro => (
                            <MenuItem key={libro.id} value={libro.id}>
                                {libro.titulo}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleCrearPrestamo}
                    disabled={cargando}
                >
                    {cargando ? 'Cargando...' : 'Crear Préstamo'}
                </Button>
            </Box>
        </Container>
    );
};

export default CrearPrestamo;
