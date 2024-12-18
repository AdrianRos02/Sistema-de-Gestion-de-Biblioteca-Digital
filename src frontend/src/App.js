import React from 'react';
import Usuarios from './Usuarios';
import CrearUsuario from './CrearUsuario';
import Libros from './Libros';
import CrearLibro from './CrearLibro';

function App() {
  return (
    <div>
      <h1>Sistema de Gestión de Biblioteca</h1>
      <Usuarios />
      <CrearUsuario />
      <Libros />

    </div>
  );
}

export default App;