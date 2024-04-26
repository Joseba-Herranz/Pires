import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Modal, Button, Checkbox } from 'antd';
import Seleccion from './Seleccion';
import Escribir from './Escribir';
//import 'antd/dist/antd.css';

import moment from 'moment';
import 'moment/locale/es';
import axios from 'axios';
import './tabla.css';

function TableComponent() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRowDetails, setSelectedRowDetails] = useState(null);
    const [text, setText] = useState('');
    const naranja = ['Camión pesada inicial', 'Aviso a conductor para toma de muestra', 'Muestra tomada', 'Pedido con Permiso descarga', 'Aviso a conductor para ir a descargar'];

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
    //     {
    //         key: '1',
    //         vNombre: '010101',
    //         fPedido: '2021-10-01',
    //         hPesado: '08:00',
    //         carga: '30',
    //         nBultos: '4',
    //         envasado: true,
    //         nMatricula: '1020ALD',
    //         nConductor: 'Juan Pérez',
    //         descripcion: 'Acido',
    //         cAlmacen: '1030',
    //         cBascula: '15',
    //         pMuestra: '1031',
    //         pDescarga: '1030',
    //         cPrevista: '15',
    //         estado: 'Camión pesada inicial',
    //         obsvLaboratorio: '',
    //         obsvDescargador: '',
    //     },
    //     {
    //         key: '2',
    //         vNombre: '020202',
    //         fPedido: '2021-11-15',
    //         hPesado: '10:30',
    //         carga: '45',
    //         nBultos: '2',
    //         envasado: true,
    //         nMatricula: '2030JBD',
    //         nConductor: 'Laura Gómez',
    //         descripcion: 'Acido',
    //         cAlmacen: '1030',
    //         cBascula: '20',
    //         pMuestra: '1031',
    //         pDescarga: '1030',
    //         cPrevista: '20',
    //         estado: 'Aviso a conductor para toma de muestra',
    //         obsvLaboratorio: '',
    //         obsvDescargador: ''
    //     },
    //     {
    //         key: '3',
    //         vNombre: '030303',
    //         fPedido: '2022-01-10',
    //         hPesado: '07:45',
    //         carga: '50',
    //         nBultos: '5',
    //         envasado: true,
    //         nMatricula: '5041OKL',
    //         nConductor: 'Carlos Ruiz',
    //         descripcion: 'Acido',
    //         cAlmacen: '1030',
    //         cBascula: '25',
    //         pMuestra: '1031',
    //         pDescarga: '1030',
    //         cPrevista: '25',
    //         estado: 'Muestra analizada',
    //         obsvLaboratorio: '',
    //         obsvDescargador: ''
    //     },
    ]);

    useEffect(() => {
        axios.get('http://52.214.60.157:8080/api/cabecera/relacion')
        .then(response => {
            console.log(response.data); 
            const dataSource = response.data.cabeza.map(item => ({
                    key: item.id.toString(),
                    nPedido: item.id_navision,
                    vNombre: item.venta_nombre,
                    fPedido: item.fecha_registro,
                    hPesado: moment(item.hora_pesado_bruto).format('HH:mm'),
                    carga: item.carga,
                    nBultos: item.n_bultos,
                    envasado: true,
                    nMatricula: item.n_matricula,
                    nConductor: item.nombre_conductor,
                    descripcion: item.lineas && item.lineas.length > 0 ? item.lineas[0].descripcion : '',
                    cAlmacen: item.lineas && item.lineas.length > 0 ? item.lineas[0].codigo_almacen : '',
                    cBascula: item.lineas && item.lineas.length > 0 ? item.lineas[0].cantidad_bascula : '',
                    pMuestra: item.lineas && item.lineas.length > 0 ? item.lineas[0].linea_muestras : '',
                    pDescarga: item.lineas && item.lineas.length > 0 ? item.lineas[0].codigo_almacen : '',
                    cPrevista: item.lineas && item.lineas.length > 0 ? item.lineas[0].cantidad_prevista : '',
                    estado: item.lineas && item.lineas.length > 0 && item.lineas[0].estado !== null ? item.lineas[0].estado : 'Camión sin llegar',
                    obsvLaboratorio: '',
                    obsvDescargador: '',

                }));
                console.log(dataSource);
                setDataSource(dataSource); 
            })
            .catch(error => console.error('There was an error getting the data:', error));
    }, []);

    const columns = () => ([
        // {
        //     title: 'Venta a nombre',
        //     dataIndex: 'vNombre',
        //     key: 'vNombre'
        // },
        // {
        //     title: 'Fecha prevista del pedido',
        //     dataIndex: 'fPedido',
        //     key: 'fPedido'
        // },
        // {
        //     title: 'Hora pesado bruto',
        //     dataIndex: 'hPesado',
        //     key: 'hPesado'
        // },
        // {
        //     title: 'Carga',
        //     dataIndex: 'carga',
        //     key: 'carga'
        // },
        // {
        //     title: 'Nº de bultos',
        //     dataIndex: 'nBultos',
        //     key: 'nBultos'
        // },
        // {
        //     title: 'Envasado',
        //     dataIndex: 'envasado',
        //     key: 'envasado',
        //     render: (text, record) => (
        //         <Checkbox checked={record.envasado} onChange={(e) => handleCheck(e, record.key)} />
        //     ),
        // },
        // {
        //     title: 'Nº matricula',
        //     dataIndex: 'nMatricula',
        //     key: 'nMatricula'
        // },
        // {
        //     title: 'Nombre conductor',
        //     dataIndex: 'nConductor',
        //     key: 'nConductor'
        // },
        {
            title: 'Nº Pedido',
            dataIndex: 'nPedido',
            key: 'nPedido',
        },
        {
            title: 'Descripcion',
            dataIndex: 'descripcion',
            key: 'descripcion'
        },
        // {
        //     title: 'Codigo de almacen',
        //     dataIndex: 'cAlmacen',
        //     key: 'cAlmacen'
        // },
        // {
        //     title: 'Cantidad en bascula ',
        //     dataIndex: 'cBascula',
        //     key: 'cBascula'
        // },
        {
            title: 'Punto de muestra',
            dataIndex: 'pMuestra',
            key: 'pMuestra'
        },
        {
            title: 'Punto de descarga laboratorio',
            dataIndex: 'pDescarga',
            key: 'pDescarga'
        },
        {
            title: 'Cantidad prevista',
            dataIndex: 'cPrevista',
            key: 'cPrevista'
        },
        // {
        //     title: 'Peso descargado en cada linea',
        //     dataIndex: 'pDescargado',
        //     key: 'pDescargado',

        // },
        {
            title: 'Observaciones de laboratorio',
            dataIndex: 'obsvLaboratorio',
            key: 'obsvLaboratorio',
            // render: (_, record) => (
            //     <Button onClick={() => showObservacionesModal(record)}>Ver observaciones</Button>
            // ),

        },
        {
            title: 'Observaciones de Bascula',
            dataIndex: 'obsvLaboratorio',
            key: 'obsvLaboratorio',

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
                    naranja={naranja}
                    tipo={0}
                />

            ),
        },
        {
            title: 'Observaciones de descargador',
            dataIndex: 'obsvDescargador',
            key: 'obsvDescargador',
            render: (_, record) => (
                <Escribir
                    value={record.pDescargaLab}
                    onChange={e => handleObservacionesChange(record.key, e.target.value, 'obsvDescargador')}
                    placeholder={'Observaciones de Descarga'}
                />
            ),
        },
        {
            title: 'Detalles',
            key: 'detalles',
            render: (_, record) => (
                <Button onClick={() => showModal(record)}>Ver Detalles</Button>
            ),
        },
    ]).map(col => ({
        ...col,
        onHeaderCell: () => ({
            style: { backgroundColor: '#f0f2f5' }
        }),
    }));

    const columns2 = () => ([
        {
            title: 'Venta a nombre',
            dataIndex: 'vNombre',
            key: 'vNombre'
        },
        {
            title: 'Fecha prevista del pedido',
            dataIndex: 'fPedido',
            key: 'fPedido'
        },
        {
            title: 'Hora pesado bruto',
            dataIndex: 'hPesado',
            key: 'hPesado'
        },
        {
            title: 'Carga',
            dataIndex: 'carga',
            key: 'carga'
        },
        {
            title: 'Nº de bultos',
            dataIndex: 'nBultos',
            key: 'nBultos'
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
            title: 'Nº matricula',
            dataIndex: 'nMatricula',
            key: 'nMatricula'
        },
        {
            title: 'Nombre conductor',
            dataIndex: 'nConductor',
            key: 'nConductor'
        },
        {
            title: 'Descripcion',
            dataIndex: 'descripcion',
            key: 'descripcion'
        },
        {
            title: 'Codigo de almacen',
            dataIndex: 'cAlmacen',
            key: 'cAlmacen'
        },
        {
            title: 'Cantidad en bascula ',
            dataIndex: 'cBascula',
            key: 'cBascula'
        },
        {
            title: 'Punto de descarga laboratorio',
            dataIndex: 'pDescarga',
            key: 'pDescarga'
        },
        {
            title: 'Cantidad prevista',
            dataIndex: 'cPrevista',
            key: 'cPrevista'
        },
        {
            title: 'Peso descargado en cada linea',
            dataIndex: 'pDescargado',
            key: 'pDescargado',

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
                    naranja={naranja}
                />

            ),
        },
        {
            title: 'Observaciones de laboratorio',
            dataIndex: 'obsvLaboratorio',
            key: 'obsvLaboratorio',

        },
        {
            title: 'Observaciones de Bascula',
            dataIndex: 'obsvLaboratorio',
            key: 'obsvLaboratorio',

        },
        {
            title: 'Observaciones de descargador',
            dataIndex: 'obsvDescargador',
            key: 'obsvDescargador',
            render: (_, record) => (
                <Escribir
                    value={record.pDescargaLab}
                    onChange={e => handleObservacionesChange(record.key, e.target.value, 'obsvDescargador')}
                    placeholder={'Observaciones de Descarga'}
                />
            ),
        },
    ]).map(col => ({
        ...col,
        onHeaderCell: () => ({
            style: { backgroundColor: '#f0f2f5' }
        }),
    }));

    const stateColorValue = {
        "Incidencia": 1, 
        'Camión pesada inicial': 2,
        'Aviso a conductor para toma de muestra': 2,
        'Muestra tomada': 2,
        'Pedido con Permiso descarga': 2,
        'Aviso a conductor para ir a descargar': 2,
    };
    
    const sortedData = dataSource.sort((a, b) => {
        const colorA = stateColorValue[a.estado] || 3;
        const colorB = stateColorValue[b.estado] || 3;
        if (colorA < colorB) return -1;
        if (colorA > colorB) return 1;
    
        return new Date('1970/01/01 ' + a.hPesado) - new Date('1970/01/01 ' + b.hPesado);
    });

    return (
        <div className='Table'>
            <Table dataSource={sortedData} columns={columns()} pagination={false} />
            <Modal title="Detalles de la fila" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <table className='table'>
                    <tbody>
                        {columns2().map(column => (
                            <tr key={column.key}>
                                <th>{column.title}</th>
                                <td>{selectedRowDetails && selectedRowDetails[column.dataIndex] ? selectedRowDetails[column.dataIndex] : 'Ninguna'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>
            {/*<Modal title="Observaciones" visible={isObservacionesModalVisible} onOk={() => setIsObservacionesModalVisible(false)} onCancel={() => setIsObservacionesModalVisible(false)}>
                <p>{selectedRowDetails?.obsvDescargador}</p>
                <p>{selectedRowDetails?.obsvLaboratorio}</p> 
            </Modal> */}
        </div>
    );
}
export default TableComponent;