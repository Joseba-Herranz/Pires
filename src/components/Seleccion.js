import React, { useState } from 'react';
import { Select } from 'antd';

const Seleccion = ({ estadoInicial, onEstadoChange, recordKey, naranja }) => {
    const [estado, setEstado] = useState(estadoInicial);
    const [estadoPrevio, setEstadoPrevio] = useState(null);

    const estadoSiguiente = {
        'Camión sin llegar': ['Camión pesada inicial'],
        'Camión pesada inicial': ['Camión sin llegar', 'Aviso a conductor para toma de muestra'],
        'Aviso a conductor para toma de muestra': ['Camión pesada inicial', 'Muestra tomada'],
        'Muestra tomada': ['Aviso a conductor para toma de muestra', 'Muestra enviada a Laboratorio'],
        'Muestra enviada a Laboratorio': ['Muestra tomada', 'Muestra Recibida por el laboratorio'],
        'Muestra Recibida por el laboratorio': ['Muestra enviada a Laboratorio', 'Muestra en análisis'],
        'Muestra en análisis': ['Muestra Recibida por el laboratorio', 'Muestra analizada'],
        'Muestra analizada': ['Muestra en análisis', 'Pedido con Permiso descarga'],
        'Pedido con Permiso descarga': ['Muestra analizada', 'Aviso a conductor para ir a descargar'],
        'Aviso a conductor para ir a descargar': ['Pedido con Permiso descarga', 'Vehículo descargado'],
        'Vehículo descargado': ['Aviso a conductor para ir a descargar', 'Vehículo pesado'],
        'Vehículo pesado': ['Vehículo descargado', 'Pedido finalizado', 'Pedido con Permiso descarga'],
    }

    const opcionSiguiente = estadoSiguiente[estado] || [];

    if (!opcionSiguiente.includes('Incidencia')) {
        opcionSiguiente.push('Incidencia');
    }

    const handleChange = (value) => {
        if (value === 'Incidencia' && estado !== 'Incidencia') {
            setEstadoPrevio(estado);
        } else if (estado === 'Incidencia' && value !== 'Incidencia') {
            setEstadoPrevio(null);
        }

        setEstado(value);
        onEstadoChange(recordKey, value);
    };

    const getSelectStatusClass = (estado) => {
        if (estado === 'Incidencia') {
            return 'selectRojo';
        } else if (naranja.includes(estado)) {
            return 'selectNaranja';
        }
        return '';
    };

    if (estado === 'Incidencia' && estadoPrevio && !opcionSiguiente.includes(estadoPrevio)) {
        opcionSiguiente.push(estadoPrevio);
    }

    return (
        <Select
            value={estado}
            onChange={handleChange}
            className={getSelectStatusClass(estado)}
            style={{ width: '100%' }}
        >
            {opcionSiguiente.map((siguienteEstado) => (
                <Select.Option key={siguienteEstado} value={siguienteEstado}>
                    {siguienteEstado}
                </Select.Option>
            ))}
        </Select>
    );
};

export default Seleccion;
