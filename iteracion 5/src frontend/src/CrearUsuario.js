import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Grid, Paper } from '@mui/material';

const CrearUsuario = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validar los campos antes de enviar
        if (!username || !email || !password) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        const newUser = {
            username,
            email,
            password,
        };

        // Hacer la solicitud POST para crear un nuevo usuario
        axios.post('http://127.0.0.1:8000/api/usuarios/', newUser)
            .then(response => {
                console.log("Usuario creado:", response.data);
                setUsername('');
                setEmail('');
                setPassword('');
                setError('');
                window.location.reload();
            })
            .catch(error => {
                console.error("Hubo un error al crear el usuario:", error);
                setError("Hubo un problema al crear el usuario.");
            });
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 4 }}>
            <Paper sx={{ padding: 3 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Crear Usuario
                </Typography>

                {/* Mostrar errores si los hay */}
                {error && (
                    <Box sx={{ color: 'red', mb: 2 }}>
                        <Typography variant="body2">{error}</Typography>
                    </Box>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Crear Usuario
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default CrearUsuario;