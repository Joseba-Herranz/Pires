import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Space } from 'antd';
import Seleccion from './Seleccion';
import Escribir from './Escribir';
import moment from 'moment';
import 'moment/locale/es';
import axios from 'axios';
import './tabla.css';

function TableComponent() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRowDetails, setSelectedRowDetails] = useState(null);
    const [text, setText] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const [updateStatus, setUpdateStatus] = useState({});
    const [observacionInput, setObservacionInput] = useState({});
    const [dataSource, setDataSource] = useState([]);

    const showModal = (record) => {
        setSelectedRowDetails(record);
        setText(record.observacionesBCD);
        setIsModalVisible(true);
    };

    const handleOk = () => setIsModalVisible(false);

    const handleCancel = () => setIsModalVisible(false);

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const clearFilters = () => setFilteredInfo({});

    const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
    };

    const setAgeSort = () => {
        setSortedInfo({
            order: 'descend',
            columnKey: 'age',
        });
    };

    const handleEstadoChange = (key, nuevoEstado) => {
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

            setObservacionInput(prev => ({ ...prev, [id]: '' }));
            setUpdateStatus(prev => ({ ...prev, [id]: 'ok' }));

            setTimeout(() => {
                setUpdateStatus(prev => ({ ...prev, [id]: undefined }));
                loadData();
            }, 5000);
        })
        .catch(error => {
            console.error(error);
            setUpdateStatus(prev => ({ ...prev, [id]: 'error' }));

            setTimeout(() => {
                setUpdateStatus(prev => ({ ...prev, [id]: undefined }));
            }, 5000);
        });
    };

    const handleObservacionesBlurDescargador = (id) => {
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
        // Translate logic here
    };

    const loadData = () => {
        axios.get('http://52.214.60.157:8080/api/cabecera/relacion')
            .then(response => {
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
                        obsLaboratorio: linea.observaciones_laboratorio_bascula || '',
                        obsBascula: linea.observaciones_bascula_camion_descarga || '',
                        obsvDescargador: linea.observaciones_descargador || '',
                        estado: linea.estado !== null ? linea.estado : 'Camión sin llegar',
                        estadoActual: linea.estadoAsociado.descripcion,
                        estadosRelacion: linea.estadoAsociado.estados_rel,
                    }));
                });
                setDataSource(dataSource);
            })
            .catch(error => console.error('There was an error getting the data:', error));
    };

    useEffect(() => {
        loadData();
    }, []);

    const columns = () => ([
        {
            title: 'Nº Pedido',
            dataIndex: 'nPedido',
            key: 'nPedido',
            sorter: (a, b) => a.nPedido.localeCompare(b.nPedido),
            sortOrder: sortedInfo.columnKey === 'nPedido' ? sortedInfo.order : null,
        },
        {
            title: 'Descripcion',
            dataIndex: 'descripcion',
            key: 'descripcion',
            sorter: (a, b) => a.descripcion.localeCompare(b.descripcion),
            sortOrder: sortedInfo.columnKey === 'descripcion' ? sortedInfo.order : null,
        },
        {
            title: 'Punto de descarga laboratorio',
            dataIndex: 'pDescarga',
            key: 'pDescarga',
            sorter: (a, b) => a.pDescarga.localeCompare(b.pDescarga),
            sortOrder: sortedInfo.columnKey === 'pDescarga' ? sortedInfo.order : null,
        },
        {
            title: 'Punto de muestra',
            dataIndex: 'pMuestra',
            key: 'pMuestra',
            sorter: (a, b) => a.pMuestra.localeCompare(b.pMuestra),
            sortOrder: sortedInfo.columnKey === 'pMuestra' ? sortedInfo.order : null,
        },
        {
            title: 'Cantidad prevista',
            dataIndex: 'cPrevista',
            key: 'cPrevista',
            sorter: (a, b) => a.cPrevista.localeCompare(b.cPrevista),
            sortOrder: sortedInfo.columnKey === 'cPrevista' ? sortedInfo.order : null,
        },
        {
            title: 'Observaciones de laboratorio',
            dataIndex: 'obsLaboratorio',
            key: 'obsLaboratorio',
            sorter: (a, b) => a.obsLaboratorio.localeCompare(b.obsLaboratorio),
            sortOrder: sortedInfo.columnKey === 'obsLaboratorio' ? sortedInfo.order : null,
        },
        {
            title: 'Observaciones de Bascula',
            dataIndex: 'obsBascula',
            key: 'obsBascula',
            sorter: (a, b) => a.obsBascula.localeCompare(b.obsBascula),
            sortOrder: sortedInfo.columnKey === 'obsBascula' ? sortedInfo.order : null,
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            sorter: (a, b) => (stateColorValue[a.estado] || 4) - (stateColorValue[b.estado] || 4),
            sortOrder: sortedInfo.columnKey === 'estado' ? sortedInfo.order : null,
            render: (text, record) => (
                <Seleccion
                    estadoNum={record.estado}
                    estadoInicial={record.estadoActual}
                    estadosRelacion={record.estadosRelacion}
                    onEstadoChange={handleEstadoChange}
                    recordKey={record.key}
                    loadData={loadData}
                    tipo={3}
                />
            ),
        },
        {
            title: 'Observaciones de descargador',
            dataIndex: 'obsvDescargador',
            key: 'obsvDescargador',
            sorter: (a, b) => a.obsvDescargador.localeCompare(b.obsvDescargador),
            sortOrder: sortedInfo.columnKey === 'obsvDescargador' ? sortedInfo.order : null,
            render: (_, record) => (
                <div>
                    {updateStatus[record.key] && (
                        <span style={{ color: updateStatus[record.key] === 'ok' ? 'green' : 'red' }}>
                            {updateStatus[record.key] === 'ok' ? 'Actualización exitosa' : 'Error al actualizar'}
                        </span>
                    )}
                    <Escribir
                        className={record.obsvDescargador ? 'input-with-data' : ''}
                        placeholder={'Observaciones'}
                        defaultValue={record.obsvDescargador || ''}
                        value={observacionInput[record.key] || ''}
                        onChange={(e) => {
                            const { value } = e.target;
                            setObservacionInput(prevState => ({
                                ...prevState,
                                [record.key]: value,
                            }));
                        }}
                        onBlur={() => handleObservacionesBlurDescargador(record.key)}
                        onKeyPress={(e) => handleKeyPressDescargador(e, record.key)}
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
            key: 'vNombre',
        },
        {
            title: 'Fecha prevista del pedido',
            dataIndex: 'fPedido',
            key: 'fPedido',
        },
        {
            title: 'Hora pesado bruto',
            dataIndex: 'hPesado',
            key: 'hPesado',
        },
        {
            title: 'Carga',
            dataIndex: 'carga',
            key: 'carga',
        },
        {
            title: 'Nº de bultos',
            dataIndex: 'nBultos',
            key: 'nBultos',
        },
        {
            title: 'Envasado',
            dataIndex: 'envasado',
            key: 'envasado',
        },
        {
            title: 'Nº matricula',
            dataIndex: 'nMatricula',
            key: 'nMatricula',
        },
        {
            title: 'Nombre conductor',
            dataIndex: 'nConductor',
            key: 'nConductor',
        },
        {
            title: 'Descripcion',
            dataIndex: 'descripcion',
            key: 'descripcion',
        },
        {
            title: 'Codigo de almacen',
            dataIndex: 'cAlmacen',
            key: 'cAlmacen',
        },
        {
            title: 'Cantidad en bascula ',
            dataIndex: 'cBascula',
            key: 'cBascula',
        },
        {
            title: 'Punto de descarga laboratorio',
            dataIndex: 'pDescarga',
            key: 'pDescarga',
        },
        {
            title: 'Cantidad prevista',
            dataIndex: 'cPrevista',
            key: 'cPrevista',
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

    // const statePriority = {
    //         "Incidencia": 10,
    //         'Camión pesada inicial': 2,
    //         'Aviso a conductor para toma de muestra': 2,
    //         'Muestra tomada': 2,
    //         'Pedido con Permiso descarga': 2,
    //         'Aviso a conductor para ir a descargar': 2,
    //         'Otros': 5,
    //     };

    // const sortedData = dataSource.sort((a, b) => {
    //     const priorityA = statePriority[a.estado] || Infinity;
    //     const priorityB = statePriority[b.estado] || Infinity;

    //     if (priorityA !== priorityB) {
    //         return priorityB - priorityA;
    //     } else {
    //         return moment(a.hModificacion, "HH:mm:ss").diff(moment(b.hModificacion, "HH:mm:ss"));
    //     }
    // });

    const stateColorValue = {
        "Incidencia": 1,
        'Camión pesada inicial': 2,
        'Aviso a conductor para toma de muestra': 2,
        'Muestra tomada': 2,
        'Pedido con Permiso descarga': 2,
        'Aviso a conductor para ir a descargar': 2,
    };

    // const sortedData = dataSource.sort((a, b) => {
    //     const colorA = stateColorValue[a.estado] || 4;
    //     const colorB = stateColorValue[b.estado] || 4;
    //     if (colorA !== colorB) {
    //         return colorA - colorB;
    //     }

    //     const dateA = a.hModificacion ? moment(a.hModificacion, 'HH:mm:ss') : moment(a.hPesado, 'HH:mm:ss');
    //     const dateB = b.hModificacion ? moment(b.hModificacion, 'HH:mm:ss') : moment(b.hPesado, 'HH:mm:ss');

    //     return dateA.isBefore(dateB) ? -1 : 1;
    // });

    return (
        <div className='Table'>
            {/* <Space style={{ marginBottom: 16 }}>
                <Button onClick={clearFilters}>Clear filters</Button>
                <Button onClick={clearAll}>Clear filters and sorters</Button>
            </Space> */}
            <Table dataSource={dataSource} columns={columns()} pagination={false} onChange={handleChange} style={{ padding: "10px" }} />
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



// const stateColorValue = {
//     "Incidencia": 1,
//     'Camión pesada inicial': 2,
//     'Aviso a conductor para toma de muestra': 2,
//     'Muestra tomada': 2,
//     'Pedido con Permiso descarga': 2,
//     'Aviso a conductor para ir a descargar': 2,
// };

// const sortedData = dataSource.sort((a, b) => {
//     const colorA = stateColorValue[a.estado] || 4;
//     const colorB = stateColorValue[b.estado] || 4;
//     if (colorA !== colorB) {
//         return colorA - colorB;
//     }

//     const dateA = a.hModificacion ? moment(a.hModificacion, 'HH:mm:ss') : moment(a.hPesado, 'HH:mm:ss');
//     const dateB = b.hModificacion ? moment(b.hModificacion, 'HH:mm:ss') : moment(b.hPesado, 'HH:mm:ss');

//     return dateA.isBefore(dateB) ? -1 : 1;
// });