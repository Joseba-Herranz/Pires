import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Modal, Button, Checkbox } from 'antd';
import Seleccion from './Seleccion';
import Escribir from './Escribir';
import DescLab from './DescLab';

import moment from 'moment';
import 'moment/locale/es';
import axios from 'axios';
//import 'antd/dist/antd.css';
import './tabla.css';

function TableComponent() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRowDetails, setSelectedRowDetails] = useState(null);
    const [text, setText] = useState('');
    const [sortedInfo, setSortedInfo] = useState({});
    const naranja = ['Muestra enviada a Laboratorio', 'Muestra Recibida por el laboratorio', 'Muestra en análisis', 'Pendiente descarga'];
    const [updateStatus, setUpdateStatus] = useState({});
    const [originalData, setOriginalData] = useState([]);

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

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        //setFilteredInfo(filters);
        setSortedInfo(sorter);
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

    const [observacionInput, setObservacionInput] = useState({});

    const handleObservacionesChange = (id, event) => {
        setObservacionInput(prev => ({ ...prev, [id]: event.target.value }));
        console.log("handleObservacionesChange:", id, event.target.value);
    };

    const handleObservacionesBlur = (id) => {
        // Solo actualizamos si el input aún tiene valor, evitando dobles llamadas
        if (observacionInput[id]) {
            updateObservacionesLab(id);
        }
    };

    const handleKeyPress = (e, id) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateObservacionesLab(id);
        }
    };
    const updateObservacionesLab = (id) => {
        const updatedObservation = { "observaciones_laboratorio_bascula": observacionInput[id] };
        axios({
            method: 'put',
            url: `http://52.214.60.157:8080/api/linea/${id}`,
            headers: { 'Content-Type': 'application/json' },
            data: updatedObservation,
        })
            .then(response => {
                setDataSource(prevState => {
                    const index = prevState.findIndex((item) => item.id_item === id);
                    return [
                        ...prevState.slice(0, index),
                        { ...prevState[index], observacionesLab: observacionInput[id] },
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

    const [dataSource, setDataSource] = useState([]);

    const loadData = () => {
        axios.get('http://52.214.60.157:8080/api/cabecera/relacion')
            .then(response => {
                console.log(response.data);
                const dataSource = response.data.cabeza.flatMap(cabecera => {
                    return cabecera.lineas.map(linea => ({
                        key: linea.id.toString(),
                        id_item: linea.id,
                        vNombre: cabecera.id_navision,
                        name: cabecera.venta_nombre,
                        hPesado: moment.utc(cabecera.hora_pesado_bruto).format("HH:mm:ss"),
                        hModificacion: moment.utc(linea.updatedAt).add(2, 'hours').format("HH:mm:ss") || '',
                        pBruto: cabecera.peso_bruto,
                        pNeto: (cabecera.peso_bruto - cabecera.peso_tara),
                        nBultos: cabecera.n_bulto,
                        envasado: linea.codigo_almacen === 'envasado' ? 'Si' : 'No',
                        tipo: linea.type,
                        descripcion: linea.descripcion,
                        //cAlmacen: traductor(linea.codigo_almacen),
                        cAlmacen: linea.codigo_almacen,
                        cantBascula: linea.cantidad_bascula,
                        tBulto: linea.tipo_bulto,
                        bultos: linea.bulto,
                        pDescargaLab: linea.punto_descarga_laboratorio || '',
                        observacionesLab: linea.observaciones_laboratorio_bascula || '',
                        nuevaMuestra: linea.linea_muestras || '',
                        muestrasProporcionadas: linea.muestras_proporcionadas || '',
                        //estado: 'Camión sin llegar',
                        obsDescargador: linea.observaciones_descargador || '',
                        obsBascula: linea.observaciones_bascula_camion_descarga || '',
                        estado: linea.estado !== null ? linea.estado : 'Camión sin llegar',
                        estadoActual: linea.estadoAsociado.descripcion,
                        estadosRelacion: linea.estadoAsociado.estados_rel,
                    }));
                });
                setDataSource(dataSource);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    const columns = () => ([
        {
            title: 'Venta a nombre',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
        },
        // {
        //     title: 'Peso bruto',
        //     dataIndex: 'pBruto',
        //     key: 'pBruto',
        //     sorter: (a, b) => a.pBruto.length - b.pBruto.length,
        //     sortOrder: sortedInfo.columnKey === 'pBruto' ? sortedInfo.order : null,
        // },
        // {
        //     title: 'Nº Bultos',
        //     dataIndex: 'nBultos',
        //     key: 'nBultos',
        //     sorter: (a, b) => a.nBultos.length - b.nBultos.length,
        //     sortOrder: sortedInfo.columnKey === 'nBultos' ? sortedInfo.order : null,
        // },
        // {
        //     title: 'Envasado',
        //     dataIndex: 'envasado',
        //     key: 'envasado',
        //     render: (text, record) => (
        //         <Checkbox checked={record.envasado} onChange={(e) => handleCheck(e, record.key)} />
        //     ),
        //     sorter: (a, b) => a.envasado.length - b.envasado.length,
        //     sortOrder: sortedInfo.columnKey === 'envasado' ? sortedInfo.order : null,
        // },
        // {
        //     title: 'Tipo',
        //     dataIndex: 'tipo',
        //     key: 'tipo',
        //     sorter: (a, b) => a.tipo.length - b.tipo.length,
        //     sortOrder: sortedInfo.columnKey === 'tipo' ? sortedInfo.order : null,
        // },
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
            sorter: (a, b) => a.descripcion.length - b.descripcion.length,
            sortOrder: sortedInfo.columnKey === 'descripcion' ? sortedInfo.order : null,
        },
        {
            title: 'Código almacén',
            dataIndex: 'cAlmacen',
            key: 'cAlmacen',
            sorter: (a, b) => a.cAlmacen.length - b.cAlmacen.length,
            sortOrder: sortedInfo.columnKey === 'cAlmacen' ? sortedInfo.order : null,
        },
        {
            title: 'Peso neto',
            dataIndex: 'pNeto',
            key: 'pNeto',
            sorter: (a, b) => a.pNeto.length - b.pNeto.length,
            sortOrder: sortedInfo.columnKey === 'pNeto' ? sortedInfo.order : null,
        },
        {
            title: 'Cantidad Báscula',
            dataIndex: 'cantBascula',
            key: 'cantBascula',
            sorter: (a, b) => a.cantBascula.length - b.cantBascula.length,
            sortOrder: sortedInfo.columnKey === 'cantBascula' ? sortedInfo.order : null,
        },
        {
            title: 'Tipo bulto',
            dataIndex: 'tBulto',
            key: 'tBulto',
            sorter: (a, b) => a.tBulto.length - b.tBulto.length,
            sortOrder: sortedInfo.columnKey === 'tBulto' ? sortedInfo.order : null,
        },
        // {
        //     title: 'Bultos',
        //     dataIndex: 'bultos',
        //     key: 'bultos',
        //     sorter: (a, b) => a.bultos.length - b.bultos.length,
        //     sortOrder: sortedInfo.columnKey === 'bultos' ? sortedInfo.order : null,
        // },
        {
            title: 'Observaciones descargador',
            dataIndex: 'obsDescargador',
            key: 'obsDescargador',
            sorter: (a, b) => a.obsDescargador.length - b.obsDescargador.length,
            sortOrder: sortedInfo.columnKey === 'obsDescargador' ? sortedInfo.order : null,
        },
        {
            title: 'Observaciones bascula',
            dataIndex: 'obsBascula',
            key: 'obsBascula',
            sorter: (a, b) => a.obsBascula.length - b.obsBascula.length,
            sortOrder: sortedInfo.columnKey === 'obsBascula' ? sortedInfo.order : null,
        },
        {
            title: 'Muestras Proporcionadas',
            dataIndex: 'muestrasProporcionadas',
            key: 'muestrasProporcionadas',
            sorter: (a, b) => a.muestrasProporcionadas.length - b.muestrasProporcionadas.length,
            sortOrder: sortedInfo.columnKey === 'muestrasProporcionadas' ? sortedInfo.order : null,
        },
        {
            title: 'Hora modificación',
            dataIndex: 'hModificacion',
            key: 'hModificacion',
            sorter: (a, b) => moment(a.hModificacion).valueOf() - moment(b.hModificacion).valueOf(),
            sortOrder: sortedInfo.columnKey === 'hModificacion' ? sortedInfo.order : null,
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
                    onEstadoChange={handleEstadoChange}
                    recordKey={record.id_item}
                    loadData={loadData}
                    tipo={2}
                />
            ),
            sorter: (a, b) => a.estado.length - b.estado.length,
            sortOrder: sortedInfo.columnKey === 'estado' ? sortedInfo.order : null,
        },
        {
            title: 'Punto de descarga laboratorio',
            dataIndex: 'pDescargaLab',
            key: 'pDescargaLab',
            render: (_, record) => (
                <DescLab></DescLab>
            ),
            sorter: (a, b) => a.pDescargaLab.length - b.pDescargaLab.length,
            sortOrder: sortedInfo.columnKey === 'pDescargaLab' ? sortedInfo.order : null,
        },
        {
            title: 'Observaciones',
            dataIndex: 'observacionesBCD',
            key: 'observacionesBCD',
            render: (_, record, observaciones) => (
                <div>
                    {updateStatus[record.id_item] && (
                        <span style={{ color: updateStatus[record.id_item] === 'ok' ? 'green' : 'red' }}>
                            {updateStatus[record.id_item] === 'ok' ? 'Actualización exitosa' : 'Error al actualizar'}
                        </span>
                    )}
                    <Input
                        className={record.observacionesBCD ? 'input-with-data' : ''}
                        placeholder={record.observacionesBCD || 'Observaciones'}
                        value={observacionInput[record.id_item] || ''}
                        onBlur={() => handleObservacionesBlur(record.id_item)}
                        onKeyDown={(e) => handleKeyPress(e, record.id_item)}
                        onChange={(e) => handleObservacionesChange(record.id_item, e)}
                    />
                </div>
            ),
            sorter: (a, b) => a.observacionesBCD.length - b.observacionesBCD.length,
            sortOrder: sortedInfo.columnKey === 'observacionesBCD' ? sortedInfo.order : null,
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
            sorter: (a, b) => a.nuevaMuestra.length - b.nuevaMuestra.length,
            sortOrder: sortedInfo.columnKey === 'nuevaMuestra' ? sortedInfo.order : null,
        },
        {
            title: 'Detalles',
            key: 'detalles',
            render: (_, record) => (
                <Button onClick={() => showModal(record)}>Ver Detalles</Button>
            ),
            sorter: (a, b) => a.detalles.length - b.detalles.length,
            sortOrder: sortedInfo.columnKey === 'detalles' ? sortedInfo.order : null,
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
            title: 'Venta a Nombre',
            dataIndex: 'name',
            key: 'name',
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

        },
        {
            title: 'Observaciones descargador',
            dataIndex: 'obsDescargador',
            key: 'obsDescargador',

        },
        {
            title: 'Observaciones bascula',
            dataIndex: 'obsBascula',
            key: 'obsBascula',
        },
        {
            title: 'Punto de descarga laboratorio',
            dataIndex: 'pDescargaLab',
            key: 'pDescargaLab',
            // render: (_, record) => (
            //     <Escribir
            //         value={record.pDescargaLab}
            //         onChange={e => handleObservacionesChange(record.key, e.target.value, 'pDescargaLab')}
            //         placeholder={'Punto de Descarga'}
            //     />
            // ),
        },
        {
            title: 'Observaciones',
            dataIndex: 'observacionesBCD',
            key: 'observacionesBCD',

        },
        {
            title: 'Solicita nueva muestra',
            dataIndex: 'nuevaMuestra',
            key: 'nuevaMuestra',

        },
        {
            title: 'Muestras Proporcionadas',
            dataIndex: 'muestrasProporcionadas',
            key: 'muestrasProporcionadas',

        },

    ]).map(col => ({
        ...col,
        onHeaderCell: () => ({
            style: { backgroundColor: '#f0f2f5' }
        }),
    }));

    const stateColorValue = {
        "Incidencia": 1,
        'Muestra enviada a Laboratorio': 2,
        'Muestra Recibida por el laboratorio': 2,
        'Muestra en análisis': 2,
        'Pendiente descarga': 2,
        'Muestra tomada': 3,
    };

    // const sortedData = dataSource.sort((a, b) => {

    //     const colorA = stateColorValue[a.estado] || 4;
    //     const colorB = stateColorValue[b.estado] || 4;
    //     if (colorA < colorB) return -1;
    //     if (colorA > colorB) return 1;

    //     // if (colorA === colorB) {
    //     //     return a.vNombre.localeCompare(b.vNombre);
    //     // }

    //     // if (!a.hPesado || !b.hPesado) {
    //     //     return 0;
    //     // }

    //     const dateA = moment(a.hPesado, ' h:mm:ss ');
    //     const dateB = moment(b.hPesado, ' h:mm:ss ');
    //     return dateA - dateB;
    // });

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