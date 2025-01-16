import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true); // Para controlar el estado de carga

    useEffect(() => {
        // Hacer la solicitud GET a la API para obtener los usuarios
        axios.get('http://127.0.0.1:8000/api/usuarios/')
            .then(response => {
                setUsuarios(response.data);  // Guardar los usuarios en el estado
                setLoading(false);  // Terminar el estado de carga
            })
            .catch(error => {
                console.error("Hubo un error al obtener los usuarios:", error);
                setLoading(false);  // Terminar el estado de carga incluso si hay un error
            });
    }, []);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Usuarios
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {usuarios.map(usuario => (
                        <Grid item xs={12} sm={6} md={4} key={usuario.id}>
                            <Card sx={{ maxWidth: 345 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {usuario.username}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>ID:</strong> {usuario.id}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" paragraph>
                                        <strong>Email:</strong> {usuario.email}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Usuarios;