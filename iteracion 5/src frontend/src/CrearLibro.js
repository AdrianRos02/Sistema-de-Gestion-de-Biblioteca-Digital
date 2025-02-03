import React, { useState } from 'react';
import axios from 'axios';

const CrearLibro = () => {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [estado, setEstado] = useState('disponible');
    const [ubicacion, setUbicacion] = useState('');

    
    const handleSubmit = (event) => {
        event.preventDefault();

        const newBook = {
            titulo,
            autor,
            categoria,
            estado,
            ubicacion,
        };

        // Hacer la solicitud POST para crear un nuevo libro
        axios.post('http://127.0.0.1:8000/api/libros/', newBook)
            .then(response => {
                console.log("Libro creado:", response.data);
                setTitulo('');
                setAutor('');
                setCategoria('');
                setEstado('disponible');
                setUbicacion('');
            })
            .catch(error => {
                console.error("Hubo un error al crear el libro:", error);
            });
    };

    return (
        <div>
            <h1>Crear Libro</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título:</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>
                <div>
                    <label>Autor:</label>
                    <input
                        type="text"
                        value={autor}
                        onChange={(e) => setAutor(e.target.value)}
                    />
                </div>
                <div>
                    <label>Categoría:</label>
                    <input
                        type="text"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                    />
                </div>
                <div>
                    <label>Estado:</label>
                    <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <option value="disponible">Disponible</option>
                        <option value="prestado">Prestado</option>
                    </select>
                </div>
                <div>
                    <label>Ubicación:</label>
                    <input
                        type="text"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                    />
                </div>
                <button type="submit">Crear Libro</button>
            </form>
        </div>
    );
};

export default CrearLibro;