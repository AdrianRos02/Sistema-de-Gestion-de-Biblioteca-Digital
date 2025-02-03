import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Button } from '@mui/material';

const CategoriaList = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categorias/')
      .then(response => setCategorias(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/categorias/${id}/`)
      .then(response => setCategorias(categorias.filter(categoria => categoria.id !== id)))
      .catch(error => console.error('Error:', error));
  };

  return (
    <Container>
      <Grid container spacing={2}>
        {categorias.map(categoria => (
          <Grid item xs={12} sm={6} md={4} key={categoria.id}>
            <Card>
              <CardContent>
                <h3>{categoria.nombre}</h3>
                <Button onClick={() => handleDelete(categoria.id)}>Eliminar</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CategoriaList;
