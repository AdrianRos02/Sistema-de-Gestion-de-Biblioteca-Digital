import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, Grid, Box, CircularProgress, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(""); // Estado para la búsqueda
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/usuarios/')
            .then(response => {
                setUsuarios(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Hubo un error al obtener los usuarios:", error);
                setLoading(false);
            });
    }, []);

    // Filtrar usuarios por nombre
    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.username.toLowerCase().includes(search.toLowerCase())
    );

    // Manejo de la apertura del diálogo de confirmación
    const handleOpenDialog = (usuario) => {
        setSelectedUser(usuario);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    // Eliminar usuario
    const handleDeleteUser = () => {
        if (selectedUser) {
            axios.delete(`http://127.0.0.1:8000/api/usuarios/${selectedUser.id}/`)
                .then(() => {
                    setUsuarios(usuarios.filter(user => user.id !== selectedUser.id));
                    handleCloseDialog();
                })
                .catch(error => {
                    console.error("Error al eliminar el usuario:", error);
                    handleCloseDialog();
                });
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Usuarios
            </Typography>

            <TextField
                label="Buscar usuario por nombre..."
                variant="outlined"
                fullWidth
                margin="normal"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredUsuarios.map(usuario => (
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
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        onClick={() => handleOpenDialog(usuario)}>
                                        Eliminar
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Diálogo de confirmación de eliminación */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar al usuario "{selectedUser?.username}"? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Cancelar</Button>
                    <Button onClick={handleDeleteUser} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Usuarios;
