import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Modal, Button } from 'antd';
import Seleccion from './Seleccion';
import axios from 'axios';
//import 'antd/dist/antd.css';
import moment from 'moment';
import 'moment/locale/es';
import './tabla.css';

const Escribir = ({ onChange, value }) => {
  return <Input placeholder="Observaciones" value={value} onChange={onChange} />;
};

function TableComponent() {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowDetails, setSelectedRowDetails] = useState(null);
  const [text, setText] = useState('');

  const naranja = ["Vehículo descargado", "Vehículo pesado"];

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
  const handleObservacionesChange = (key, newObservaciones) => {
    const newData = dataSource.map(item => {
      if (item.key === key) {
        return { ...item, observacionesBCD: newObservaciones };
      }
      return item;
    });
    setDataSource(newData);
  };
  // const [dataSource, setDataSource] = useState([
  //   {
  //     key: '4',
  //     nPedido: '010104',
  //     name: 'ALUDIUM',
  //     hPesado: '12:00',
  //     nMatricula: '4314RDC',
  //     nomConductor: 'Juan',
  //     observacionesTrans: '',
  //     descripcion: 'Acido',
  //     pDescarga: '1030',
  //     cantidad: '20',
  //     observacionesDesc: '',
  //     observacionesLab: '',
  //     observacionesBCD: '',
  //     estado: 'Camión sin llegar',
  //   },
  //   {
  //     key: '5',
  //     nPedido: '010105',
  //     name: 'ALUDIUM',
  //     hPesado: '12:00',
  //     nMatricula: '2234JPT',
  //     nomConductor: 'Pepe',
  //     observacionesTrans: '',
  //     descripcion: 'Acido',
  //     pDescarga: '1030',
  //     cantidad: '20',
  //     observacionesDesc: '',
  //     observacionesLab: '',
  //     observacionesBCD: '',
  //     estado: 'Vehículo descargado',
  //   },
  //   {
  //     key: '6',
  //     nPedido: '010106',
  //     name: 'ALUDIUM',
  //     hPesado: '12:00',
  //     nMatricula: '2052JUN',
  //     nomConductor: 'Francisco',
  //     observacionesTrans: '',
  //     descripcion: 'Acido',
  //     pDescarga: '1030',
  //     cantidad: '20',
  //     observacionesDesc: '',
  //     observacionesLab: '',
  //     observacionesBCD: '',
  //     estado: 'Muestra analizada',
  //   },
  // ]);

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    axios.get('http://52.214.60.157:8080/api/cabecera/relacion')
    .then(response => {
        console.log(response.data); 
        const dataSource = response.data.cabeza.map(item => ({
                key: item.id.toString(),
                nPedido: item.id_navision,
                name: item.venta_nombre,
                hPesado: moment(item.hora_pesado_bruto).format('HH:mm'),
                nMatricula: item.n_matricula,
                nomConductor: item.nombre_conductor,
                observacionesTrans: item.observacionesTrans || '',
                descripcion: item.lineas && item.lineas.length > 0 ? item.lineas[0].descripcion : '',
                pDescarga: item.lineas && item.lineas.length > 0 ? item.lineas[0].codigo_almacen : '',
                cantidad: item.lineas && item.lineas.length > 0 ? item.lineas[0].cantidad : '',
                observacionesDesc: item.lineas && item.lineas.length > 0 ? item.lineas[0].observacionesDesc : '',
                observacionesLab: item.lineas && item.lineas.length > 0 ? item.lineas[0].observacionesLab : '',
                observacionesBCD: item.lineas && item.lineas.length > 0 ? item.lineas[0].observacionesBCD : '',
                estado: item.lineas && item.lineas.length > 0 && item.lineas[0].estado !== null ? item.lineas[0].estado : 'Camión sin llegar',
            }));
            console.log(dataSource);
            setDataSource(dataSource); 
        })
        .catch(error => console.error('There was an error getting the data:', error));
}, []);

  const columns = () => ([
    {
      title: 'Nº Pedido',
      dataIndex: 'nPedido',
      key: 'nPedido',
    },
    {
      title: 'Venta a Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Hora Pesado Bruto',
      dataIndex: 'hPesado',
      key: 'hPesado',
    },
    {
      title: 'Nº Matricula',
      dataIndex: 'nMatricula',
      key: 'nMatricula',
    },
    {
      title: 'Nombre Conductor',
      dataIndex: 'nomConductor',
      key: 'nomConductor',
    },
    {
      title: 'Punto de Descarga',
      dataIndex: 'pDescarga',
      key: 'pDescarga',
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
          tipo={1}
        />
      ),
    },
    {
      title: 'Observaciones',
      dataIndex: 'observacionesBCD',
      key: 'observacionesBCD',
      render: (_, record) => (
        <Escribir
          value={record.observacionesBCD}
          onChange={e => handleObservacionesChange(record.key, e.target.value)}
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

  const stateColorValue = {
    "Incidencia": 1,
    "Vehículo descargado": 2, 
    "Vehículo pesado": 2,
    "Camion sin llegar": 3,
  };

  const sortedData = dataSource.sort((a, b) => {

    const colorA = stateColorValue[a.estado] || 4;
    const colorB = stateColorValue[b.estado] || 4;
    if (colorA < colorB) return -1;
    if (colorA > colorB) return 1;

    return new Date('1970/01/01 ' + a.hPesado) - new Date('1970/01/01 ' + b.hPesado);
  });

  return (
    <div className="Table">
      <Table dataSource={sortedData} columns={columns()} pagination={false} />
      <Modal title="Detalles de la fila" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <table className='table'>
          <tbody>
            <tr>
              <th>Número de Pedido</th>
              <td>{selectedRowDetails?.nPedido}</td>
            </tr>
            <tr>
              <th>Venta a Nombre</th>
              <td>{selectedRowDetails?.name}</td>
            </tr>
            <tr>
              <th>Hora de Pesado Bruto</th>
              <td>{selectedRowDetails?.hPesado}</td>
            </tr>
            <tr>
              <th>Número de matrícula</th>
              <td>{selectedRowDetails?.nMatricula}</td>
            </tr>
            <tr>
              <th>Nombre del conductor</th>
              <td>{selectedRowDetails?.nomConductor}</td>
            </tr>
            <tr>
              <th>Observaciones Navision</th>
              <td>{selectedRowDetails?.observacionesNav || 'Ninguna'}</td>
            </tr>
            <tr>
              <th>Descripción del residuo</th>
              <td>{selectedRowDetails?.descripcion}</td>
            </tr>
            <tr>
              <th>Punto de Descarga</th>
              <td>{selectedRowDetails?.pDescarga}</td>
            </tr>
            <tr>
              <th>Cantidad prevista</th>
              <td>{selectedRowDetails?.cantidad || 'No especificado'}</td>
            </tr>
            <tr>
              <th>Observaciones de descarga </th>
              <td>{selectedRowDetails?.observacionesBCD || 'Ninguna'}</td>
            </tr>
            <tr>
              <th>Observaciones de laboratorio</th>
              <td>{selectedRowDetails?.observacionesBCD || 'Ninguna'}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{selectedRowDetails?.estado}</td>
            </tr>
            <tr>
              <th>Observaciones</th>
              <td>{selectedRowDetails?.observacionesBCD || 'Ninguna'}</td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </div>
  );
}
export default TableComponent;