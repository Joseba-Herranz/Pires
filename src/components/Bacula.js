import React, { useState } from 'react';
import { Table, Select, Input, Modal, Button } from 'antd';
//import 'antd/dist/antd.css';
import './tabla.css';

const Seleccion = ({ estadoInicial, onEstadoChange, recordKey }) => {
  const [estado, setEstado] = useState(estadoInicial);
  const [estadoPrevio, setEstadoPrevio] = useState(null);

  const naranja = ["Camión sin llegar", "Vehículo descargado", "Vehículo pesado"];

  const estadoSiguiente = {
    'Camión sin llegar': ['Camión pesada inicial'],
    'Camión pesada inicial': ['Camión sin llegar', 'Aviso a conductor para toma de muestra'],
    'Aviso a conductor para toma de muestra': ['Camión pesada inicial', 'Muestra tomada'],
    'Muestra tomada': ['Aviso a conductor para toma de muestra', 'Muestra enviada a Laboratorio'],
    'Muestra enviada a Laboratorio': ['Muestra tomada', 'Muestra Recibida por el laboratorio'],
    'Muestra Recibida por el laboratorio': ['Muestra enviada a Laboratorio', 'Muestra en análisis'],
    'Muestra en análisis': ['Muestra Recibida por el laboratorio', 'Muestra analizada'],
    'Muestra analizada': ['Muestra en análisis', 'Pedido con Permiso descarga'],
    'Pedido con Permiso descarga': ['Muestra analizada', 'Aviso a conductor para ir a descargar'],
    'Aviso a conductor para ir a descargar': ['Pedido con Permiso descarga', 'Vehículo descargado'],
    'Vehículo descargado': ['Aviso a conductor para ir a descargar', 'Vehículo pesado'],
    'Vehículo pesado': ['Vehículo descargado', 'Pedido finalizado', 'Pedido con Permiso descarga'],
  }

  const opcionSiguiente = estadoSiguiente[estado] || [];

  if (!opcionSiguiente.includes('Incidencia')) {
    opcionSiguiente.push('Incidencia');
  }

  const handleChange = (value) => {
    if (value === 'Incidencia' && estado !== 'Incidencia') {
      setEstadoPrevio(estado);
    } else if (estado === 'Incidencia' && value !== 'Incidencia') {
      setEstadoPrevio(null);
    }

    setEstado(value);
    onEstadoChange(recordKey, value);
  };

  const getSelectStatusClass = (estado) => {
    if (estado === 'Incidencia') {
      return 'selectRojo';
    } else if (naranja.includes(estado)) {
      return 'selectNaranja';
    }
    return '';
  };

  if (estado === 'Incidencia' && estadoPrevio && !opcionSiguiente.includes(estadoPrevio)) {
    opcionSiguiente.push(estadoPrevio);
  }

  return (
    <Select
      value={estado}
      onChange={handleChange}
      className={getSelectStatusClass(estado)}
      style={{ width: '100%' }}
    >
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
      name: 'ALUDIUM',
      hPesado: '12:00',
      nMatricula: '4314RDC',
      nomConductor: 'Juan',
      observacionesTrans: '',
      descripcion: 'Acido',
      pDescarga: '1030',
      cantidad: '20',
      observacionesDesc: '',
      observacionesLab: '',
      observacionesBCD: '',
      estado: 'Camión sin llegar',
    },
    {
      key: '5',
      nPedido: '010105',
      name: 'ALUDIUM',
      hPesado: '12:00',
      nMatricula: '2234JPT',
      nomConductor: 'Pepe',
      observacionesTrans: '',
      descripcion: 'Acido',
      pDescarga: '1030',
      cantidad: '20',
      observacionesDesc: '',
      observacionesLab: '',
      observacionesBCD: '',
      estado: 'Vehículo descargado',
    },
    {
      key: '6',
      nPedido: '010106',
      name: 'ALUDIUM',
      hPesado: '12:00',
      nMatricula: '2052JUN',
      nomConductor: 'Francisco',
      observacionesTrans: '',
      descripcion: 'Acido',
      pDescarga: '1030',
      cantidad: '20',
      observacionesDesc: '',
      observacionesLab: '',
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
      title: 'Acciones',
      key: 'acciones',
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