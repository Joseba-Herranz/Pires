import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Modal, Button, Checkbox } from 'antd';
import Seleccion from './Seleccion';
import Escribir from './Escribir';
import DescLab from './DescLab';

import axios from 'axios';
//import 'antd/dist/antd.css';
import './tabla.css';

function TableComponent() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRowDetails, setSelectedRowDetails] = useState(null);
    const [text, setText] = useState('');
    const naranja = ['Muestra enviada a Laboratorio', 'Muestra Recibida por el laboratorio', 'Muestra en análisis', 'Pendiente descarga'];

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
        // {
        //     key: '1',
        //     vNombre: '010101',
        //     pBruto: '25',
        //     pNeto: '20',
        //     nBultos: '4',
        //     envasado: true,
        //     tipo: 'Articulo',
        //     descripcion: 'Ácido sulfúrico',
        //     cAlmacen: '1030',
        //     cantBascula: '15',
        //     tBulto: '20010',
        //     bultos: '4',
        //     pDescargaLab: '',
        //     observacionesBCO: '',
        //     nuevaMuestra: '',
        //     muestrasProporcionadas: '',
        //     hModificacion: '08:30',
        //     estado: 'Muestra enviada a Laboratorio',
        //     obsvDescargador: '',
        //     obsvLaboratorio: '',
        // },
        // {
        //     key: '2',
        //     vNombre: '010102',
        //     pBruto: '30',
        //     pNeto: '25',
        //     nBultos: '5',
        //     envasado: true,
        //     tipo: 'Articulo',
        //     descripcion: 'Ácido sulfúrico',
        //     cAlmacen: '1030',
        //     cantBascula: '20',
        //     tBulto: '20010',
        //     bultos: '5',
        //     pDescargaLab: '',
        //     observacionesBCO: '',
        //     nuevaMuestra: '',
        //     muestrasProporcionadas: '',
        //     hModificacion: '09:40',
        //     estado: 'Muestra en análisis',
        //     obsvDescargador: '',
        //     obsvLaboratorio: '',
        // },
        // {
        //     key: '3',
        //     vNombre: '010103',
        //     pBruto: '28',
        //     pNeto: '23',
        //     nBultos: '6',
        //     envasado: false,
        //     tipo: 'Articulo',
        //     descripcion: 'Ácido sulfúrico',
        //     cAlmacen: '1030',
        //     cantBascula: '18',
        //     tBulto: '20010',
        //     bultos: '6',
        //     pDescargaLab: '',
        //     observacionesBCO: '',
        //     nuevaMuestra: '',
        //     muestrasProporcionadas: '',
        //     hModificacion: '10:15',
        //     estado: 'Muestra tomada',
        //     obsvDescargador: '',
        //     obsvLaboratorio: '',
        // },
        // {
        //     key: '4',
        //     vNombre: '010104',
        //     pBruto: '30',
        //     pNeto: '20',
        //     nBultos: '5',
        //     envasado: false,
        //     tipo: 'Articulo',
        //     descripcion: 'Ácido sulfúrico',
        //     cAlmacen: '1030',
        //     cantBascula: '20',
        //     tBulto: '20010',
        //     bultos: '5',
        //     pDescargaLab: '',
        //     observacionesBCO: '',
        //     nuevaMuestra: '',
        //     muestrasProporcionadas: '',
        //     hModificacion: '10:00',
        //     estado: 'Permiso descarga',
        //     obsvDescargador: '',
        //     obsvLaboratorio: '',
        // },
    ]);

    useEffect(() => {
        axios.get('http://52.214.60.157:8080/api/cabecera/relacion')
        .then(response => {
            console.log(response.data); 
            const dataSource = response.data.cabeza.map(item => ({
                key: item.id.toString(),
                vNombre: item.id_navision,
                pBruto: item.peso_bruto,
                pNeto: (item.peso_bruto - item.peso_tara),
                nBultos: item.n_bulto,
                envasado: false,
                tipo: item.lineas && item.lineas.length > 0 ? item.lineas[0].type : 'No type',
                descripcion: item.lineas && item.lineas.length > 0 ? item.lineas[0].descripcion : '',
                cAlmacen: item.lineas && item.lineas.length > 0 ? item.lineas[0].codigo_almacen : '',
                cantBascula: item.lineas && item.lineas.length > 0 ? item.lineas[0].cantidad_bascula : '',
                tBulto: item.lineas && item.lineas.length > 0 ? item.lineas[0].tipo_bulto : '',
                bultos: item.lineas && item.lineas.length > 0 ? item.lineas[0].bulto : '',
                pDescargaLab: item.lineas && item.lineas.length > 0 ? item.lineas[0].punto_descarga_laboratorio || '' : '',
                observacionesBCO: item.lineas && item.lineas.length > 0 ? item.lineas[0].obsevaciones_bascula_camion_descarga || '' : '',
                nuevaMuestra: item.lineas && item.lineas.length > 0 ? item.lineas[0].linea_muestras || '' : '',
                muestrasProporcionadas: item.lineas && item.lineas.length > 0 ? item.lineas[0].muestras_proporcionadas || '' : '',
                hModificacion: item.lineas && item.lineas.length > 0 ? item.lineas[0].hora_modificacion || '' : '',
                estado: item.lineas && item.lineas.length > 0 ? item.lineas[0].estado || 'No state' : 'No state',
                obsvDescargador: '', 
                obsvLaboratorio: '', 
            }));
            
        
                setDataSource(dataSource);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const columns = () => ([
        {
            title: 'Nº Pedido',
            dataIndex: 'vNombre',
            key: 'vNombre',
        },
        // {
        //     title: 'Peso bruto',
        //     dataIndex: 'pBruto',
        //     key: 'pBruto',
        // },

        // {
        //     title: 'Nº Bultos',
        //     dataIndex: 'nBultos',
        //     key: 'nBultos',
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
        //     title: 'Tipo',
        //     dataIndex: 'tipo',
        //     key: 'tipo',
        // },
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
            title: 'Peso neto',
            dataIndex: 'pNeto',
            key: 'pNeto',
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
        // {
        //     title: 'Bultos',
        //     dataIndex: 'bultos',
        //     key: 'bultos',
        // },


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
            title: 'Muestras Proporcionadas',
            dataIndex: 'muestrasProporcionadas',
            key: 'muestrasProporcionadas',
            // render: (_, record) => (
            //     <Escribir
            //         value={record.muestrasProporcionadas}
            //         onChange={e => handleObservacionesChange(record.key, e.target.value, 'muestrasProporcionadas')}
            //         placeholder={'Muestra'}
            //     />
            // ),
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
                    naranja={naranja}
                    tipo={2}
                />

            ),
        },
        {
            title: 'Punto de descarga laboratorio',
            dataIndex: 'pDescargaLab',
            key: 'pDescargaLab',
            render: (_, record) => (
                <DescLab></DescLab>
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
            title: 'Detalles',
            key: 'detalles',
            render: (_, record) => (
                <Button onClick={() => showModal(record)}>Ver Detalles</Button>
            ),
        }

    ]).map(col => ({
        ...col,
        onHeaderCell: () => ({
            style: { backgroundColor: '#f0f2f5' }
        }),
    }));

    const columns2 = () => ([
        {
            title: 'Nº Pedido',
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
        // {
        //     title: 'Tipo',
        //     dataIndex: 'tipo',
        //     key: 'tipo',
        // },
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
                    naranja={naranja}
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

    const stateColorValue = {
        "Incidencia": 0, 
        'Muestra enviada a Laboratorio': 1, 
        'Muestra Recibida por el laboratorio': 1, 
        'Muestra en análisis': 1, 
        'Pendiente descarga': 1,
        'Muestra tomada': 2,
    };

    const sortedData = dataSource.sort((a, b) => {

        const colorA = stateColorValue[a.estado] || 3;
        const colorB = stateColorValue[b.estado] || 3;
        if (colorA < colorB) return -1;
        if (colorA > colorB) return 1;

        // If 'estado' is the same for both records, sort by another field (e.g., 'vNombre').
        if (colorA === colorB) {
            return a.vNombre.localeCompare(b.vNombre);
        }
        
        // If 'hModificacion' is not set or not in a date format for both records, sort by order in data source.
        if (!a.hModificacion || !b.hModificacion) {
            return 0;
    }
    
        return new Date('1970/01/01 ' + a.hModificacion) - new Date('1970/01/01 ' + b.hModificacion);
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
        </div>
    );
}
export default TableComponent;