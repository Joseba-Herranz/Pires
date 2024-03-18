import React, { useState } from 'react';
import { Table, Select, Input, Modal, Button } from 'antd';
//import 'antd/dist/antd.css';
import './tabla.css';

const Escribir = ({ onChange, value, placeholder }) => {
    return <Input value={value} onChange={onChange} placeholder={placeholder} />;
};

const Seleccion = ({ estadoInicial, onEstadoChange, recordKey }) => {
    const [estado, setEstado] = useState(estadoInicial);

    const naranja = ["Camión pesada inicial", "Aviso a conductor para toma de muestra", "Muestra tomada", "Pedido con Permiso descarga"];

    const estadoSiguiente = {
        "Camión sin llegar": ["Camión pesada inicial"],
        "Camión pesada inicial": ["Camión sin llegar", "Aviso a conductor para ir a descargar"],
        "Aviso a conductor para ir a descargar": ["Camión pesada inicial", "Muestra tomada"],
        "Muestra tomada": ["Aviso a conductor para ir a descargar", "Muestra enviada a Laboratorio"],
        "Muestra enviada a Laboratorio": ["Muestra tomada", "Muestra Recibida por el laboratorio"],
        "Muestra Recibida por el laboratorio": ["Muestra enviada a Laboratorio", "Muestra en análisis"],
        "Muestra en análisis": ["Muestra Recibida por el laboratorio", "Muestra analizada", "Incidencia"],
        "Incidencia": ["Muestra en análisis"],
        "Muestra analizada": ["Muestra en análisis", "Vehículo pendiente de descarga"],
        "Vehículo pendiente de descarga": ["Muestra analizada", "Vehículo descargado"],
        "Vehículo descargado": ["Vehículo pendiente de descarga", "Vehículo pesado"],
        "Vehículo pesado": ["Vehículo descargado", "Pedido finalizado"],
    }

    const opcionSiguiente = estadoSiguiente[estado] || [];

    const handleChange = (value) => {
        setEstado(value);
        onEstadoChange(recordKey, value);
    };

    const selectClassName = naranja.includes(estado) ? "selectNaranja" : "";

    return (
        <Select value={estado} onChange={handleChange} className={selectClassName} style={{ width: '100%' }}>
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

    const [dataSource, setDataSource] = useState([
        {
            key: '1',
            vNombre: '010101',
            fPedido: '2021-10-01',
            hPesado: '08:00',
            carga: '30',
            nBultos: '4',
            envasado: 'Tambores',
            nMatricula: '1234ABC',
            nConductor: 'Juan Pérez',
            descripcion: 'Ácido sulfúrico',
            cAlmacen: '1030',
            cBascula: '15',
            pDescarga: '1030',
            cPrevista: '15',
            estado: 'Muestra enviada a Laboratorio',
            obsvLaboratorio: '',
            obsvDescargador: '',
        },

        {
            key: "2",
            vNombre: "020202",
            fPedido: "2021-11-15",
            hPesado: "10:30",
            carga: "45",
            nBultos: "2",
            envasado: "Bolsas",
            nMatricula: "5678DEF",
            nConductor: "Laura Gómez",
            descripcion: "Hidróxido de sodio",
            cAlmacen: "2045",
            cBascula: "20",
            pDescarga: "1030",
            cPrevista: "20",
            estado: "En tránsito",
            obsvLaboratorio: "",
            obsvDescargador: ""
        },
        {
            key: "3",
            vNombre: "030303",
            fPedido: "2022-01-10",
            hPesado: "07:45",
            carga: "50",
            nBultos: "5",
            envasado: "Cajas",
            nMatricula: "91011GHI",
            nConductor: "Carlos Ruiz",
            descripcion: "Cloruro de potasio",
            cAlmacen: "3075",
            cBascula: "25",
            pDescarga: "1030",
            cPrevista: "25",
            estado: "Descargado",
            obsvLaboratorio: "",
            obsvDescargador: ""
        },

    ]);

    const columns = () => ([
        {
            title: "Venta a nombre",
            dataIndex: "vNombre",
            key: "vNombre"
        },
        {
            title: "Fecha prevista del pedido",
            dataIndex: "fPedido",
            key: "fPedido"
        },
        {
            title: "Hora pesado bruto",
            dataIndex: "hPesado",
            key: "hPesado"
        },
        {
            title: "Carga",
            dataIndex: "carga",
            key: "carga"
        },
        {
            title: "Nº de bultos",
            dataIndex: "nBultos",
            key: "nBultos"
        },
        {
            title: "Envasado",
            dataIndex: "envasado",
            key: "envasado"
        },
        {
            title: "Nº matricula",
            dataIndex: "nMatricula",
            key: "nMatricula"
        },
        {
            title: "Nombre conductor",
            dataIndex: "nConductor",
            key: "nConductor"
        },
        {
            title: "Descripcion",
            dataIndex: "descripcion",
            key: "descripcion"
        },
        {
            title: "Codigo de almacen",
            dataIndex: "cAlmacen",
            key: "cAlmacen"
        },
        {
            title: "Cantidad en bascula",
            dataIndex: "cBascula",
            key: "cBascula"
        },
        {
            title: "Punto de descarga",
            dataIndex: "pDescarga",
            key: "pDescarga"
        },
        {
            title: "Cantidad prevista",
            dataIndex: "cPrevista",
            key: "cPrevista"
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
            title: 'Observaciones de laboratrorio',
            dataIndex: 'obsvLaboratorio',
            key: 'obsvLaboratorio',
            render: (_, record) => (
                <Escribir
                    value={record.pDescargaLab}
                    onChange={e => handleObservacionesChange(record.key, e.target.value, 'obsvLaboratorio')}
                    placeholder={'Observaciones de laboratrorio'}
                />
            ),
        },
        {
            title: 'Observaciones de descarga',
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
        <div className="Table">
            <Table dataSource={dataSource} columns={columns()} pagination={false} />
        </div>
    );
}
export default TableComponent;