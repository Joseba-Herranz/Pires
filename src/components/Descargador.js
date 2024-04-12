import React, { useState } from 'react';
import { Table, Select, Input, Modal, Button, Checkbox } from 'antd';
import Seleccion from './Seleccion';
import Escribir from './Escribir';
//import 'antd/dist/antd.css';
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
        {
            key: '1',
            vNombre: '010101',
            fPedido: '2021-10-01',
            hPesado: '08:00',
            carga: '30',
            nBultos: '4',
            envasado: true,
            nMatricula: '1020ALD',
            nConductor: 'Juan Pérez',
            descripcion: 'Acido',
            cAlmacen: '1030',
            cBascula: '15',
            pMuestra: '1031',
            pDescarga: '1030',
            cPrevista: '15',
            estado: 'Camión pesada inicial',
            obsvLaboratorio: '',
            obsvDescargador: '',
        },
        {
            key: '2',
            vNombre: '020202',
            fPedido: '2021-11-15',
            hPesado: '10:30',
            carga: '45',
            nBultos: '2',
            envasado: true,
            nMatricula: '2030JBD',
            nConductor: 'Laura Gómez',
            descripcion: 'Acido',
            cAlmacen: '1030',
            cBascula: '20',
            pMuestra: '1031',
            pDescarga: '1030',
            cPrevista: '20',
            estado: 'Aviso a conductor para toma de muestra',
            obsvLaboratorio: '',
            obsvDescargador: ''
        },
        {
            key: '3',
            vNombre: '030303',
            fPedido: '2022-01-10',
            hPesado: '07:45',
            carga: '50',
            nBultos: '5',
            envasado: true,
            nMatricula: '5041OKL',
            nConductor: 'Carlos Ruiz',
            descripcion: 'Acido',
            cAlmacen: '1030',
            cBascula: '25',
            pMuestra: '1031',
            pDescarga: '1030',
            cPrevista: '25',
            estado: 'Muestra analizada',
            obsvLaboratorio: '',
            obsvDescargador: ''
        },
    ]);

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

    return (
        <div className='Table'>
            <Table dataSource={dataSource} columns={columns()} pagination={false} />
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