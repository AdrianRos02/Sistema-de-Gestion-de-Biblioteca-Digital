import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import apiClient from './api/api';

const DevolucionPrestamo = () => {
    const [prestamoId, setPrestamoId] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleDevolucion = async () => {
        if (!prestamoId) {
            alert('Por favor ingrese un ID de préstamo');
            return;
        }

        setCargando(true);
        try {
            await apiClient.delete(`/prestamos/${prestamoId}/`);
            alert('Préstamo devuelto con éxito');
            setPrestamoId('');  // Limpiar el campo después de la devolución exitosa
        } catch (error) {
            console.error('Error al devolver el préstamo:', error);
            alert('Error al devolver el préstamo');
        } finally {
            setCargando(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Registrar Devolución
                </Typography>
                <TextField
                    fullWidth
                    label="ID del Préstamo"
                    type="number"
                    value={prestamoId}
                    onChange={(e) => setPrestamoId(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleDevolucion}
                    disabled={cargando}
                >
                    {cargando ? 'Cargando...' : 'Registrar Devolución'}
                </Button>
            </Box>
        </Container>
    );
};

export default DevolucionPrestamo;