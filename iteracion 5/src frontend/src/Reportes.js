import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const Reportes = () => {
    const [reportes, setReportes] = useState([]);  // Estado para almacenar los reportes

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/reportes/libros/');
                console.log(response.data);  // Verificar si los datos son correctos
                setReportes(response.data);  // Asignar los datos al estado
            } catch (error) {
                console.error('Error al obtener los reportes:', error);
            }
        };
        fetchReportes();
    }, []);

    return (
        <div>
            <h1>Reportes de Préstamos</h1>
            {reportes.length === 0 ? (
                <p>No hay reportes disponibles.</p>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Libro</TableCell>
                                <TableCell>Usuario</TableCell>
                                <TableCell>Fecha de Préstamo</TableCell>
                                <TableCell>Fecha de Devolución</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reportes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4}>No hay reportes disponibles.</TableCell>
                                </TableRow>
                            ) : (
                                reportes.map((reporte, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{reporte.libro}</TableCell>
                                        <TableCell>{reporte.usuario}</TableCell>
                                        <TableCell>{reporte.fecha_prestamo}</TableCell>
                                        <TableCell>{reporte.fecha_devolucion}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default Reportes;