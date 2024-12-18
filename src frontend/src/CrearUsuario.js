import React, { useState } from 'react';
import axios from 'axios';

const CrearUsuario = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

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
            })
            .catch(error => {
                console.error("Hubo un error al crear el usuario:", error);
            });
    };

    return (
        <div>
            <h1>Crear Usuario</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Crear Usuario</button>
            </form>
        </div>
    );
};

export default CrearUsuario;