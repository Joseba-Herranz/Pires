import React, { useState } from 'react';
import { Table, Select, Input, Modal, Button } from 'antd';
//import 'antd/dist/antd.css';
import './tabla.css';

const Escribir = ({ onChange, value, placeholder }) => {
    return <Input value={value} onChange={onChange} placeholder={placeholder} />;
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
            pBruto: '25',
            pNeto: '20',
            nBultos: '4',
            envasado: 'Tambores',
            tipo: 'Líquido',
            descripcion: 'Ácido sulfúrico',
            cAlmacen: '1030',
            cantBascula: '15',
            tBulto: 'Ácido',
            bultos: '4',
            pDescargaLab: '',
            observacionesBCO: '',
            nuevaMuestra: '',
            muestrasProporcionadas: '',
            hModificacion: '08:30',
        },
        {
            key: '2',
            vNombre: '010102',
            pBruto: '30',
            pNeto: '25',
            nBultos: '5',
            envasado: 'Barril',
            tipo: 'Sólido',
            descripcion: 'Ácido cítrico',
            cAlmacen: '1030',
            cantBascula: '20',
            tBulto: 'Ácido',
            bultos: '5',
            pDescargaLab: '',
            observacionesBCO: '',
            nuevaMuestra: '',
            muestrasProporcionadas: '',
            hModificacion: '09:40',
        },
        {
            key: '3',
            vNombre: '010103',
            pBruto: '28',
            pNeto: '23',
            nBultos: '6',
            envasado: 'Bolsas',
            tipo: 'Sólido',
            descripcion: 'Ácido oxálico',
            cAlmacen: '1030',
            cantBascula: '18',
            tBulto: 'Ácido',
            bultos: '6',
            pDescargaLab: '',
            observacionesBCO: '',
            nuevaMuestra: '',
            muestrasProporcionadas: '',
            hModificacion: '10:15',
        },
        {
            key: '4',
            vNombre: '010104',
            pBruto: '30',
            pNeto: '20',
            nBultos: '5',
            envasado: 'Barril',
            tipo: 'Líquido',
            descripcion: 'Ácido clorhídrico',
            cAlmacen: '1030',
            cantBascula: '20',
            tBulto: 'Ácido',
            bultos: '5',
            pDescargaLab: '',
            observacionesBCO: '',
            nuevaMuestra: '',
            muestrasProporcionadas: '',
            hModificacion: '10:00',
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
        <div className="Table">
            <Table dataSource={dataSource} columns={columns()} pagination={false} />
        </div>
    );
}
export default TableComponent;