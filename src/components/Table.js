import React, { useState } from 'react';
import { Table, Select, Input, Modal } from 'antd';
//import 'antd/dist/antd.css';
import './tabla.css';

const Seleccion = ({ estadoInicial, onEstadoChange, recordKey }) => {
  const [estado, setEstado] = useState(estadoInicial);

  const naranja = ["Camión sin llegar", "Vehículo descargado", "Vehículo pesado"];

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

const Escribir = ({ onChange, value }) => {
  return <Input placeholder="Observaciones" value={value} onChange={onChange} />;
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
  const handleObservacionesChange = (key, newObservaciones) => {
    const newData = dataSource.map(item => {
      if (item.key === key) {
        return { ...item, observacionesBCD: newObservaciones };
      }
      return item;
    });
    setDataSource(newData);
  };
  const [dataSource, setDataSource] = useState([
    {
      key: '4',
      nPedido: '010104',
      nCliente: 'CL004',
      name: 'Industrias Delta',
      date: '2024-04-04',
      nMatricula: 'MATR004',
      nomConductor: 'Conductor Cuatro',
      observaciones: 'Revisar mercancía frágil.',
      descripcion: 'Acido',
      pDescarga: '1030',
      cantidad: '25',
      observacionesBCD: '',
      estado: 'Camión sin llegar',
    },
    {
      key: '5',
      nPedido: '010105',
      nCliente: 'CL005',
      name: 'Comercial Epsilon',
      date: '2024-04-05',
      nMatricula: 'MATR005',
      nomConductor: 'Conductor Cinco',
      observaciones: 'Prioridad alta en descarga.',
      descripcion: 'Acido',
      pDescarga: '1030',
      cantidad: '20',
      observacionesBCD: '',
      estado: 'Vehículo descargado',
    },
    {
      key: '6',
      nPedido: '010106',
      nCliente: 'CL006',
      name: 'Fabricantes Zeta',
      date: '2024-04-06',
      nMatricula: 'MATR006',
      nomConductor: 'Conductor Seis',
      observaciones: 'Entregar primero los palés marcados.',
      descripcion: 'Acido',
      pDescarga: '1030',
      cantidad: '30',
      observacionesBCD: '',
      estado: 'Muestra analizada',
    },
  ]);

  const columns = () => ([
    {
      title: 'Nº Pedido',
      dataIndex: 'nPedido',
      key: 'nPedido',
    },
    {
      title: 'Nombre Cliente',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Fecha prevista',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Descripcion Residuo',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Cantidad prevista',
      dataIndex: 'cantidad',
      key: 'cantidad',
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
      title: 'Observaciones de bascula o descarga',
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
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <a onClick={() => showModal(record)}>Ver Detalles</a>
      ),
    }
  ]).map(col => ({
    ...col,
    onHeaderCell: () => ({
      style: { backgroundColor: '#f0f2f5' }
    }),
  }));

  return (
    <div className="Table">
      <Table dataSource={dataSource} columns={columns()} pagination={false} />
      <Modal title="Detalles de la fila" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <table className='table'>
          <tbody>
            <tr>
              <th>Número de Pedido</th>
              <td>{selectedRowDetails?.nPedido}</td>
            </tr>
            <tr>
              <th>Nombre del Cliente</th>
              <td>{selectedRowDetails?.name}</td>
            </tr>
            <tr>
              <th>Fecha prevista</th>
              <td>{selectedRowDetails?.date}</td>
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
              <th>Descripción del residuo</th>
              <td>{selectedRowDetails?.descripcion}</td>
            </tr>
            <tr>
              <th>Cantidad prevista</th>
              <td>{selectedRowDetails?.cantidad}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{selectedRowDetails?.estado}</td>
            </tr>
            <tr>
              <th>Observaciones de bascula o descarga</th>
              <td>{text}</td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </div>
  );
}
export default TableComponent;