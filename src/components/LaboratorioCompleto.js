import React, { useState } from 'react';
import { Table, Select, Input, Modal, Button, Checkbox } from 'antd';
//import 'antd/dist/antd.css';
import './tabla.css';

const Escribir = ({ onChange, value, placeholder }) => {
    return <Input value={value} onChange={onChange} placeholder={placeholder} />;
};

const Seleccion = ({ estadoInicial, onEstadoChange, recordKey }) => {
    const [estado, setEstado] = useState(estadoInicial);
    const [estadoPrevio, setEstadoPrevio] = useState(null);

    const naranja = ['Muestra enviada a Laboratorio', 'Muestra Recibida', 'Muestra en análisis', 'Pendiente descarga'];

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

function TableComponent() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRowDetails, setSelectedRowDetails] = useState(null);
    const [text, setText] = useState('');

    const showModal = (record) => {
        setSelectedRowDetails(record);
        console.log(record)
        setText(record.observacionesBCD);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleChange = (key, nuevoEstado) => {
        const newData = dataSource.map(item => {
            if (item.key === key) {
                return { ...item, estado: nuevoEstado };
            }
            return item;
        });
        setDataSource(newData);
    };

    const handleObservacionesChange = (key, newObservaciones, field) => {
        const newData = dataSource.map(item => {
            if (item.key === key) {
                return { ...item, [field]: newObservaciones };
            }
            return item;
        });
        setDataSource(newData);
    };

    const handleCheck = (e, key) => {
        const checked = e.target.checked;
        setDataSource((prevData) =>
            prevData.map((item) => {
                if (item.key === key) {
                    return { ...item, envasado: checked };
                }
                return item;
            })
        );
    };

    const [dataSource, setDataSource] = useState([
        {
            key: '1',
            vNombre: '010101',
            pBruto: '25',
            pNeto: '20',
            nBultos: '4',
            envasado: true,
            tipo: 'Articulo',
            descripcion: 'Ácido sulfúrico',
            cAlmacen: '1030',
            cantBascula: '15',
            tBulto: '20010',
            bultos: '4',
            pDescargaLab: '',
            observacionesBCO: '',
            nuevaMuestra: '',
            muestrasProporcionadas: '',
            hModificacion: '08:30',
            estado: 'Muestra enviada a Laboratorio',
            obsvDescargador: '',
            obsvLaboratorio: '',
        },
        {
            key: '2',
            vNombre: '010102',
            pBruto: '30',
            pNeto: '25',
            nBultos: '5',
            envasado: true,
            tipo: 'Articulo',
            descripcion: 'Ácido sulfúrico',
            cAlmacen: '1030',
            cantBascula: '20',
            tBulto: '20010',
            bultos: '5',
            pDescargaLab: '',
            observacionesBCO: '',
            nuevaMuestra: '',
            muestrasProporcionadas: '',
            hModificacion: '09:40',
            estado: 'Muestra en análisis',
            obsvDescargador: '',
            obsvLaboratorio: '',
        },
        {
            key: '3',
            vNombre: '010103',
            pBruto: '28',
            pNeto: '23',
            nBultos: '6',
            envasado: false,
            tipo: 'Articulo',
            descripcion: 'Ácido sulfúrico',
            cAlmacen: '1030',
            cantBascula: '18',
            tBulto: '20010',
            bultos: '6',
            pDescargaLab: '',
            observacionesBCO: '',
            nuevaMuestra: '',
            muestrasProporcionadas: '',
            hModificacion: '10:15',
            estado: 'Camión sin llegar',
            obsvDescargador: '',
            obsvLaboratorio: '',
        },
        {
            key: '4',
            vNombre: '010104',
            pBruto: '30',
            pNeto: '20',
            nBultos: '5',
            envasado: false,
            tipo: 'Articulo',
            descripcion: 'Ácido sulfúrico',
            cAlmacen: '1030',
            cantBascula: '20',
            tBulto: '20010',
            bultos: '5',
            pDescargaLab: '',
            observacionesBCO: '',
            nuevaMuestra: '',
            muestrasProporcionadas: '',
            hModificacion: '10:00',
            estado: 'Permiso descarga',
            obsvDescargador: '',
            obsvLaboratorio: '',
        },
    ]);

    const columns = () => ([
        {
            title: 'Venta a nombre',
            dataIndex: 'vNombre',
            key: 'vNombre',
        },
        {
            title: 'Peso bruto',
            dataIndex: 'pBruto',
            key: 'pBruto',
        },
        {
            title: 'Peso neto',
            dataIndex: 'pNeto',
            key: 'pNeto',
        },
        {
            title: 'Nº Bultos',
            dataIndex: 'nBultos',
            key: 'nBultos',
        },
        {
            title: 'Envasado',
            dataIndex: 'envasado',
            key: 'envasado',
            render: (text, record) => (
                <Checkbox checked={record.envasado} onChange={(e) => handleCheck(e, record.key)} />
            ),
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
        },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
        },
        {
            title: 'Código almacén',
            dataIndex: 'cAlmacen',
            key: 'cAlmacen',
        },
        {
            title: 'Cantidad Báscula',
            dataIndex: 'cantBascula',
            key: 'cantBascula',
        },
        {
            title: 'Tipo bulto',
            dataIndex: 'tBulto',
            key: 'tBulto',
        },
        {
            title: 'Bultos',
            dataIndex: 'bultos',
            key: 'bultos',
        },
        {
            title: 'Hora modificación',
            dataIndex: 'hModificacion',
            key: 'hModificacion',
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (text, record) => (
                <Seleccion
                    estadoInicial={text}
                    onEstadoChange={handleChange}
                    recordKey={record.key}
                />
            ),
        },
        {
            title: 'Observaciones descargador',
            dataIndex: 'obsDescargador',
            key: 'obsDescargador',

        },
        {
            title: 'Observaciones bascula',
            dataIndex: 'obsLaboratorio',
            key: 'obsLaboratorio',

        },
        {
            title: 'Punto de descarga laboratorio',
            dataIndex: 'pDescargaLab',
            key: 'pDescargaLab',
            render: (_, record) => (
                <Escribir
                    value={record.pDescargaLab}
                    onChange={e => handleObservacionesChange(record.key, e.target.value, 'pDescargaLab')}
                    placeholder={'Punto de Descarga'}
                />
            ),
        },
        {
            title: 'Observaciones',
            dataIndex: 'observacionesBCO',
            key: 'observacionesBCO',
            render: (_, record) => (
                <Escribir
                    value={record.observacionesBCO}
                    onChange={e => handleObservacionesChange(record.key, e.target.value, 'observacionesBCO')}
                    placeholder={'Observaciones'}
                />
            ),
        },
        {
            title: 'Solicita nueva muestra',
            dataIndex: 'nuevaMuestra',
            key: 'nuevaMuestra',
            render: (_, record) => (
                <Escribir
                    value={record.nuevaMuestra}
                    onChange={e => handleObservacionesChange(record.key, e.target.value, 'nuevaMuestra')}
                    placeholder={'Nueva muestra'}
                />
            ),
        },
        {
            title: 'Muestras Proporcionadas',
            dataIndex: 'muestrasProporcionadas',
            key: 'muestrasProporcionadas',
            render: (_, record) => (
                <Escribir
                    value={record.muestrasProporcionadas}
                    onChange={e => handleObservacionesChange(record.key, e.target.value, 'muestrasProporcionadas')}
                    placeholder={'Muestra'}
                />
            ),
        },

    ]).map(col => ({
        ...col,
        onHeaderCell: () => ({
            style: { backgroundColor: '#f0f2f5' }
        }),
    }));

    return (
        <div className='Table'>
            <Table dataSource={dataSource} columns={columns()} pagination={false} />
        </div>
    );
}
export default TableComponent;