import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Box, CircularProgress } from '@mui/material';

const PrestamosList = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchPrestamos = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/prestamos/');
                setPrestamos(response.data);  // Aquí se almacena la lista completa de préstamos
                setCargando(false);
            } catch (error) {
                console.error('Error al obtener los préstamos:', error);
                setCargando(false);
            }
        };

        fetchPrestamos();
    }, []);

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
            {prestamos.length === 0 ? (
                <Typography variant="h6" align="center">
                    No hay préstamos disponibles.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {prestamos.map((prestamo) => (
                        <Grid item xs={12} sm={6} md={4} key={prestamo.id}>
                            <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Typography variant="h6" color="primary">
                                    ID: {prestamo.id}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Fecha de Préstamo:</strong> {prestamo.fecha_prestamo}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Usuario:</strong> {prestamo.usuario}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Libro:</strong> {prestamo.libro}
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