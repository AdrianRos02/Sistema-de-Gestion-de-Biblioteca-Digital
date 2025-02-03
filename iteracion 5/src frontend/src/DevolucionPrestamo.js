import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
import axios from 'axios';

const DevolucionPrestamo = ({ fetchPrestamos, fetchLibros }) => {
    const [prestamoId, setPrestamoId] = useState('');
    const [cargando, setCargando] = useState(false);

    // Realizar la devolución y actualizar el estado del libro
    const handleDevolucion = async () => {
        if (!prestamoId) {
            alert('Por favor ingrese un ID de préstamo');
            return;
        }
    
        setCargando(true);
        try {
            // Realiza la solicitud PUT para devolver el préstamo
            const response = await axios.put(`http://127.0.0.1:8000/api/prestamos/${prestamoId}/devolucion/`);
    
            // Maneja la respuesta exitosa
            alert(response.data.message);
            fetchPrestamos();   // Actualizar la lista de préstamos
            setPrestamoId('');  // Limpiar el campo
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
