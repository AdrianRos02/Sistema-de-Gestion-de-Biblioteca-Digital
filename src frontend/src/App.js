import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid } from '@mui/material';
import { Home, People, Book, LibraryAdd, Payment, History, Report } from '@mui/icons-material'; 
import Usuarios from './Usuarios';
import CrearUsuario from './CrearUsuario';
import Libros from './Libros';
import CrearLibro from './CrearLibro';
import PrestamosList from './PrestamosList';
import NuevoPrestamo from './NuevoPrestamo';
import DevolucionPrestamo from './DevolucionPrestamo';
import Reportes from './Reportes';

function App() {
  return (
    <Router>
      <div>
        {/* Barra de Navegación */}
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Sistema de Gestión de Biblioteca
            </Typography>
            <Button color="inherit" component={Link} to="/">Inicio</Button>
            <Button color="inherit" component={Link} to="/usuarios">Usuarios</Button>
            <Button color="inherit" component={Link} to="/crear-usuario">Crear Usuario</Button>
            <Button color="inherit" component={Link} to="/libros">Libros</Button>
            <Button color="inherit" component={Link} to="/prestamos">Préstamos</Button>
            <Button color="inherit" component={Link} to="/nuevo-prestamo">Nuevo Préstamo</Button>
            <Button color="inherit" component={Link} to="/devolucion">Devolución</Button>
            <Button color="inherit" component={Link} to="/reportes">Reportes</Button>
          </Toolbar>
        </AppBar>

        {/* Contenido Principal */}
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<HomeContent />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/crear-usuario" element={<CrearUsuario />} />
            <Route path="/libros" element={<Libros />} />
            <Route path="/prestamos" element={<PrestamosList />} />
            <Route path="/nuevo-prestamo" element={<NuevoPrestamo />} />
            <Route path="/devolucion" element={<DevolucionPrestamo />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

// Componente de contenido principal para la ruta "/"
function HomeContent() {
  return (
    <Box>
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>Bienvenido al Sistema de Gestión de Biblioteca</Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            to="/usuarios"
            startIcon={<People />}
          >
            Gestionar Usuarios
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            component={Link}
            to="/libros"
            startIcon={<Book />}
          >
            Gestionar Libros
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            component={Link}
            to="/prestamos"
            startIcon={<LibraryAdd />}
          >
            Gestionar Préstamos
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;