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
    const [updateStatus, setUpdateStatus] = useState({});
    const [originalData, setOriginalData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
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




    const [observacionInput, setObservacionInput] = useState({});
    const updateObservacionesDescargador = (id) => {
        const updatedObservation = { "observaciones_descargador": observacionInput[id] };
        axios({
            method: 'put',
            url: `http://52.214.60.157:8080/api/linea/${id}`,
            headers: { 'Content-Type': 'application/json' },
            data: updatedObservation,
        })
            .then(response => {
                setDataSource(prevState => {
                    const index = prevState.findIndex((item) => item.key === id);
                    return [
                        ...prevState.slice(0, index),
                        { ...prevState[index], obsvDescargador: observacionInput[id] },
                        ...prevState.slice(index + 1)
                    ];
                });

                // Limpia el input y el estado de actualización
                setObservacionInput(prev => ({ ...prev, [id]: '' }));
                setUpdateStatus(prev => ({ ...prev, [id]: 'ok' }));

                // Mantener el mensaje de estado visible durante 5 segundos
                setTimeout(() => {
                    setUpdateStatus(prev => ({ ...prev, [id]: undefined }));
                    loadData();
                }, 5000); // Ajusta el tiempo de visualización aquí
            })
            .catch(error => {
                console.error(error);
                // Establecer el estado de error
                setUpdateStatus(prev => ({ ...prev, [id]: 'error' }));

                // Mantener el mensaje de estado visible durante 5 segundos
                setTimeout(() => {
                    setUpdateStatus(prev => ({ ...prev, [id]: undefined }));
                }, 5000); // Ajusta el tiempo de visualización aquí
            });
    };

    const handleObservacionesBlurDescargador = (id) => {
        // Solo actualizamos si el input aún tiene valor, evitando dobles llamadas
        if (observacionInput[id]) {
            updateObservacionesDescargador(id);
        }
    };

    const handleKeyPressDescargador = (e, id) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateObservacionesDescargador(id);
        }
    };

    const traductor = (punto) => {
        // if (punto === 'ENVASES') {
        //     return 'Materia prima';
        // } else {
        const tipoAlmacen = punto.substr(0, 2);
        const ubicacionAlmacen = punto.substr(2, 2);
        if (tipoAlmacen === '10') {
            if (ubicacionAlmacen === '10' || ubicacionAlmacen === '11') {
                return 'Filtro';
            }
            else if (ubicacionAlmacen === '20' || ubicacionAlmacen === '21') {
                return 'Acumulador';
            }
            else if (ubicacionAlmacen === '30' || ubicacionAlmacen === '31') {
                return 'DAF';
            }
            else if (ubicacionAlmacen === '40' || ubicacionAlmacen === '41') {
                return 'Torre';
            }
            else if (ubicacionAlmacen === '50' || ubicacionAlmacen === '51') {
                return 'Destruir';
            }
            else if (ubicacionAlmacen === '60' || ubicacionAlmacen === '61') {
                return 'Fabricar';
            }
            else if (ubicacionAlmacen === '70' || ubicacionAlmacen === '71') {
                return 'Férrico';
            }
            else if (ubicacionAlmacen === '80' || ubicacionAlmacen === '81') {
                return 'A destruir o filtro con Cal, ITP';
            }
            else if (ubicacionAlmacen === '90' || ubicacionAlmacen === '91') {
                return 'Destruir (Cromo) o filtro con ferroso';
            }
        } else if (tipoAlmacen === '20') {
            return 'Inertizar';
        } else if (tipoAlmacen === '30') {
            if (ubicacionAlmacen === '10') {
                return 'B4';
            } else {
                return 'B7';
            }
        } else if (tipoAlmacen === '40') {
            return 'Carpa';
        }

    };
    const handleKeyPress = (e, id) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateObservacionesDescargador(id);
        }
    };

    const loadData = () => {
        axios.get('http://52.214.60.157:8080/api/cabecera/relacion')
            .then(response => {
                console.log(response.data);
                const dataSource = response.data.cabeza.flatMap(item => {
                    return item.lineas.map(linea => ({
                        key: linea.id.toString(),
                        nPedido: item.id_navision,
                        vNombre: item.venta_nombre,
                        fPedido: item.fecha_registro,
                        hPesado: moment.utc(item.hora_pesado_bruto).format("HH:mm:ss"),
                        hModificacion: moment.utc(linea.updatedAt).add(2, 'hours').format("HH:mm:ss") || '',
                        carga: item.carga,
                        nBultos: item.n_bultos,
                        envasado: linea.codigo_almacen === 'envasado' ? 'Si' : 'No',
                        nMatricula: item.n_matricula,
                        nConductor: item.nombre_conductor,
                        descripcion: linea.descripcion,
                        cAlmacen: linea.codigo_almacen,
                        cBascula: linea.cantidad_bascula,
                        pMuestra: linea.linea_muestras || '',
                        pDescarga: traductor(linea.codigo_almacen),
                        cPrevista: linea.cantidad_prevista || '',
                        //estado: linea.estado !== null ? linea.estado : 'Camión sin llegar',
                        //estado: 'Camión sin llegar',
                        obsLaboratorio: linea.observaciones_laboratorio_bascula || '',
                        obsBascula: linea.observaciones_bascula_camion_descarga || '',
                        obsvDescargador: linea.observaciones_descargador || '',
                        estado: linea.estado !== null ? linea.estado : 'Camión sin llegar',
                        estadoActual: linea.estadoAsociado.descripcion,
                        estadosRelacion: linea.estadoAsociado.estados_rel,
                    }));
                });
                console.log(dataSource);
                setDataSource(dataSource);
            })
            .catch(error => console.error('There was an error getting the data:', error));
    }
    useEffect(() => {
        loadData()
    }, []);

    const columns = () => ([

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
            title: 'Punto de descarga laboratorio',
            dataIndex: 'pDescarga',
            key: 'pDescarga'
        },
        {
            title: 'Punto de muestra',
            dataIndex: 'pMuestra',
            key: 'pMuestra'
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
            dataIndex: 'obsLaboratorio',
            key: 'obsLaboratorio',
            // render: (_, record) => (
            //     <Button onClick={() => showObservacionesModal(record)}>Ver observaciones</Button>
            // ),

        },
        {
            title: 'Observaciones de Bascula',
            dataIndex: 'obsBascula',
            key: 'obsBascula',

        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (text, record) => (
                <Seleccion
                    estadoNum={record.estado}
                    estadoInicial={record.estadoActual}
                    estadosRelacion={record.estadosRelacion}
                    onEstadoChange={handleChange}
                    recordKey={record.id_item}
                    loadData={loadData}
                    tipo={0}
                />

                // <Seleccion
                //     estadoInicial={text}
                //     onEstadoChange={handleChange}
                //     recordKey={record.key}
                //     naranja={naranja}
                //     tipo={0}
                // />

            ),
        },
        {
            title: 'Observaciones de descargador',
            dataIndex: 'obsvDescargador',
            key: 'obsvDescargador',
            render: (_, record) => (
                <div>
                    {updateStatus[record.id_item] && (
                        <span style={{ color: updateStatus[record.id_item] === 'ok' ? 'green' : 'red' }}>
                            {updateStatus[record.id_item] === 'ok' ? 'Actualización exitosa' : 'Error al actualizar'}
                        </span>
                    )}
                    <Escribir
                        className={record.obsvDescargador ? 'input-with-data' : ''}
                        placeholder={'Observaciones'}
                        defaultValue={record.obsvDescargador || ''}
                        value={observacionInput[record.key] || ''} // Modificado record.id_item por record.key
                        onChange={(e) => {
                            const { value } = e.target;
                            setObservacionInput(prevState => ({
                                ...prevState,
                                [record.key]: value, // Modificado record.id_item por record.key
                            }));
                        }}
                        onBlur={() => handleObservacionesBlurDescargador(record.key)} // Modificado record.id_item por record.key
                        onKeyPress={(e) => handleKeyPressDescargador(e, record.key)} // Modificado record.id_item por record.key

                    />
                </div>
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
            title: 'Nº Pedido',
            dataIndex: 'nPedido',
            key: 'nPedido',
        },
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
            title: 'Observaciones de laboratorio',
            dataIndex: 'obsLaboratorio',
            key: 'obsLaboratorio',


        },
        {
            title: 'Observaciones de Bascula',
            dataIndex: 'obsBascula',
            key: 'obsBascula',

        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',

        },

        {
            title: 'Observaciones de descargador',
            dataIndex: 'obsvDescargador',
            key: 'obsvDescargador',

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
        const colorA = stateColorValue[a.estado] || 4;
        const colorB = stateColorValue[b.estado] || 4;
        if (colorA < colorB) return -1;
        if (colorA > colorB) return 1;

        let dateA;
        let dateB;

        if (a.hModificacion) {
            dateA = moment(a.hModificacion, ' h:mm:ss ');
        } else {
            dateA = moment(a.hPesado, ' h:mm:ss ');
        }

        if (b.hModificacion) {
            dateB = moment(b.hModificacion, ' h:mm:ss ');
        } else {
            dateB = moment(b.hPesado, ' h:mm:ss ');
        }

        return dateB - dateA;
    });

    return (
        <div className='Table'>
            <Table dataSource={sortedData} columns={columns()} pagination={false} style={{ padding: "10px" }} />
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