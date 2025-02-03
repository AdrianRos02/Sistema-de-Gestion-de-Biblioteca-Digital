import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Box, CircularProgress, TextField } from '@mui/material';

const PrestamosList = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [libros, setLibros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prestamosRes, usuariosRes, librosRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/prestamos/'),
                    axios.get('http://127.0.0.1:8000/api/usuarios/'),
                    axios.get('http://127.0.0.1:8000/api/libros/')
                ]);

                setPrestamos(prestamosRes.data);
                setUsuarios(usuariosRes.data);
                setLibros(librosRes.data);
                setCargando(false);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setCargando(false);
            }
        };

        fetchData();
    }, []);

    // Obtener el nombre del usuario a partir de su ID
    const obtenerNombreUsuario = (usuarioId) => {
        const usuario = usuarios.find(u => u.id === usuarioId);
        return usuario ? usuario.username : "Desconocido";
    };

    // Obtener el título del libro a partir de su ID
    const obtenerTituloLibro = (libroId) => {
        const libro = libros.find(l => l.id === libroId);
        return libro ? libro.titulo : "Desconocido";
    };

    // Filtrar préstamos por nombre de usuario o título del libro
    const filteredPrestamos = prestamos.filter(prestamo =>
        obtenerNombreUsuario(prestamo.usuario).toLowerCase().includes(search.toLowerCase()) ||
        obtenerTituloLibro(prestamo.libro).toLowerCase().includes(search.toLowerCase())
    );

    if (cargando) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Lista de Préstamos
            </Typography>

            <TextField
                label="Buscar por Usuario o Libro..."
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {filteredPrestamos.length === 0 ? (
                <Typography variant="h6" align="center">
                    No hay préstamos disponibles.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {filteredPrestamos.map((prestamo) => (
                        <Grid item xs={12} sm={6} md={4} key={prestamo.id}>
                            <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Typography variant="h6" color="primary">
                                    Préstamo ID: {prestamo.id}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Fecha de Préstamo:</strong> {prestamo.fecha_prestamo}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Usuario:</strong> {obtenerNombreUsuario(prestamo.usuario)}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Libro:</strong> {obtenerTituloLibro(prestamo.libro)}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Fecha de Devolución:</strong> {prestamo.fecha_devolucion}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default PrestamosList;