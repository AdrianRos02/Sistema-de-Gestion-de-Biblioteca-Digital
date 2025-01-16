import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NuevoPrestamo from './NuevoPrestamo';
import PrestamosList from './PrestamosList';

const PrestamosPage = () => {
    const [prestamos, setPrestamos] = useState([]);

    // Función para obtener los préstamos desde el backend
    const fetchPrestamos = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/prestamos/');
            setPrestamos(response.data);
        } catch (error) {
            console.error('Error fetching préstamos:', error);
        }
    };

    // Llamar a fetchPrestamos al montar el componente
    useEffect(() => {
        fetchPrestamos();
    }, []);

    // Función para agregar un nuevo préstamo al estado
    const agregarPrestamo = (nuevoPrestamo) => {
        setPrestamos((prevPrestamos) => [...prevPrestamos, nuevoPrestamo]);
    };

    return (
        <div>
            <h1>Gestión de Préstamos</h1>
            {/* Asegúrate de pasar la función como prop */}
            <NuevoPrestamo onNuevoPrestamo={agregarPrestamo} />
            <PrestamosList prestamos={prestamos} />
        </div>
    );
};

export default PrestamosPage;