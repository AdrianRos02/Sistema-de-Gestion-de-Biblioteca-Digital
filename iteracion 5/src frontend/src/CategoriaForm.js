import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';

const CategoriaForm = ({ categoria, onSubmit }) => {
  const [nombre, setNombre] = useState(categoria ? categoria.nombre : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoria) {
      axios.put(`http://127.0.0.1:8000/api/categorias/${categoria.id}/`, { nombre })
        .then(response => onSubmit())
        .catch(error => console.error('Error:', error));
    } else {
      axios.post('http://127.0.0.1:8000/api/categorias/', { nombre })
        .then(response => onSubmit())
        .catch(error => console.error('Error:', error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField 
        label="Nombre de la Categoría"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <Button type="submit">{categoria ? 'Actualizar' : 'Agregar'}</Button>
    </form>
  );
};

export default CategoriaForm;
