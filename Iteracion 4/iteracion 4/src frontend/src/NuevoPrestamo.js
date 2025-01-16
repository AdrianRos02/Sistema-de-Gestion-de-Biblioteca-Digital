import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';

const NuevoPrestamo = ({ onNuevoPrestamo }) => {
    const [usuarioId, setUsuarioId] = useState('');
    const [libroId, setLibroId] = useState('');
    const [fechaDevolucion, setFechaDevolucion] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/prestamos/', {
                usuario: { id: usuarioId },  // Enviar como objeto, si es necesario
                libro: { id: libroId },      // Enviar como objeto, si es necesario
                fecha_devolucion: fechaDevolucion,
              });
            const nuevoPrestamo = response.data;

            // Verifica que la función onNuevoPrestamo se pase correctamente
            if (typeof onNuevoPrestamo === 'function') {
                onNuevoPrestamo(nuevoPrestamo);  // Llamamos la función pasada como prop
            } else {
                console.error('onNuevoPrestamo no es una función');
            }

            alert('Préstamo creado con éxito');
            setUsuarioId('');
            setLibroId('');
            setFechaDevolucion('');
        } catch (error) {
            console.error('Error al crear el préstamo:', error.response ? error.response.data : error.message);
            alert('Error al crear el préstamo');
        } finally {
            setCargando(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Crear Nuevo Préstamo
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="ID del Usuario"
                                type="number"
                                value={usuarioId}
                                onChange={(e) => setUsuarioId(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="ID del Libro"
                                type="number"
                                value={libroId}
                                onChange={(e) => setLibroId(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Fecha de Devolución"
                                type="date"
                                value={fechaDevolucion}
                                onChange={(e) => setFechaDevolucion(e.target.value)}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                type="submit"
                                disabled={cargando}
                            >
                                {cargando ? 'Cargando...' : 'Crear Préstamo'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default NuevoPrestamo;