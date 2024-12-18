import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        // Hacer la solicitud GET a la API para obtener los usuarios
        axios.get('http://127.0.0.1:8000/api/usuarios/')
            .then(response => {
                setUsuarios(response.data);  // Guardar los usuarios en el estado
            })
            .catch(error => {
                console.error("Hubo un error al obtener los usuarios:", error);
            });
    }, []);

    return (
        <div>
            <h1>Usuarios</h1>
            <ul>
                {usuarios.map(usuario => (
                    <li key={usuario.id}>{usuario.username} - {usuario.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default Usuarios;