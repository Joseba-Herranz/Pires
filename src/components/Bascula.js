import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Modal, Button } from 'antd';
import Seleccion from './Seleccion';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import './tabla.css';

const Escribir = ({ onChange, value }) => {
  return <Input placeholder="Observaciones" value={value} onChange={onChange} />;
};

function TableComponent() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowDetails, setSelectedRowDetails] = useState(null);
  const [sortedInfo, setSortedInfo] = useState({});
  const [updateStatus, setUpdateStatus] = useState({});
  const [originalData, setOriginalData] = useState([]);
  const [observacionInput, setObservacionInput] = useState({});
  const [dataSource, setDataSource] = useState([]);

  const naranja = ["Vehículo descargado", "Vehículo pesado"];

  const showModal = (record) => {
    const originalRecord = originalData.find(item => item.key === record.key);
    setSelectedRowDetails(originalRecord || record);
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

  const handleObservacionesChange = (id, event) => {
    setObservacionInput(prev => ({ ...prev, [id]: event.target.value }));
  };

  const handleObservacionesBlur = (id) => {
    if (observacionInput[id]) {
      updateObservaciones(id);
    }
  };

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateObservaciones(id);
    }
  };

  const traductor = (punto) => {
    const tipoAlmacen = punto.substr(0, 2);
    const ubicacionAlmacen = punto.substr(2, 2);
    // Add your logic to translate the punto here
    // ...
  };

  const updateObservaciones = (id) => {
    const updatedObservation = { "observaciones_bascula_camion_descarga": observacionInput[id] };
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
            { ...prevState[index], observacionesBCD: observacionInput[id] },
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
        setUpdateStatus(prev => ({ ...prev, [id]: 'error' }));
        setTimeout(() => {
          setUpdateStatus(prev => ({ ...prev, [id]: undefined }));
        }, 5000);
      });
  };

  const loadData = () => {
    axios.get('http://52.214.60.157:8080/api/cabecera/relacion')
      .then(response => {
        const dataSource = [];
        response.data.cabeza.forEach(item => {
          item.lineas.forEach(linea => {
            dataSource.push({
              key: linea.id.toString(),
              id_item: linea.id || '',
              nPedido: item.id_navision,
              name: item.venta_nombre,
              hPesado: moment.utc(item.hora_pesado_bruto).format("HH:mm:ss"),
              pBruto: item.peso_bruto,
              nMatricula: item.n_matricula,
              nomConductor: item.nombre_conductor,
              observacionesTrans: item.observacionesTrans || '',
              descripcion: linea.descripcion || '',
              pDescarga: traductor(linea.codigo_almacen || ''),
              cantidad: linea.cantidad || '',
              observacionesDesc: linea.observacionesDesc || '',
              observacionesLab: linea.observaciones_laboratorio_bascula || '',
              observacionesBCD: linea.observaciones_bascula_camion_descarga || '',
              estado: linea.estado !== null ? linea.estado : 'Camión sin llegar',
              estadoActual: linea.estadoAsociado.descripcion,
              estadosRelacion: linea.estadoAsociado.estados_rel,
            });
          });
        });
        setDataSource(dataSource);
        setOriginalData(dataSource);
      })
      .catch(error => console.error('There was an error getting the data:', error));
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      title: 'Nº Pedido',
      dataIndex: 'nPedido',
      key: 'nPedido',
      sorter: (a, b) => a.nPedido.localeCompare(b.nPedido),
      sortOrder: sortedInfo.columnKey === 'nPedido' ? sortedInfo.order : null,
      filterSearch: true,
      onFilter: (value, record) => record.nPedido.startsWith(value),
    },
    {
      title: 'Venta a Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
    },
    {
      title: 'Hora Pesado Bruto',
      dataIndex: 'hPesado',
      key: 'hPesado',
      sorter: (a, b) => a.hPesado.localeCompare(b.hPesado),
      sortOrder: sortedInfo.columnKey === 'hPesado' ? sortedInfo.order : null,
    },
    {
      title: 'Nº Matricula',
      dataIndex: 'nMatricula',
      key: 'nMatricula',
      sorter: (a, b) => a.nMatricula.localeCompare(b.nMatricula),
      sortOrder: sortedInfo.columnKey === 'nMatricula' ? sortedInfo.order : null,
    },
    {
      title: 'Nombre Conductor',
      dataIndex: 'nomConductor',
      key: 'nomConductor',
      sorter: (a, b) => a.nomConductor.localeCompare(b.nomConductor),
      sortOrder: sortedInfo.columnKey === 'nomConductor' ? sortedInfo.order : null,
    },
    {
      title: 'Punto de Descarga',
      dataIndex: 'pDescarga',
      key: 'pDescarga',
      sorter: (a, b) => a.pDescarga.localeCompare(b.pDescarga),
      sortOrder: sortedInfo.columnKey === 'pDescarga' ? sortedInfo.order : null,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      sorter: (a, b) => a.estado - b.estado,
      sortOrder: sortedInfo.columnKey === 'estado' ? sortedInfo.order : null,
      render: (text, record) => (
        <Seleccion
          estadoNum={record.estado}
          estadoInicial={record.estadoActual}
          estadosRelacion={record.estadosRelacion}
          onEstadoChange={handleChange}
          recordKey={record.id_item}
          loadData={loadData}
          tipo={1}
        />
      ),
    },
    {
      title: 'Observaciones',
      dataIndex: 'observacionesBCD',
      key: 'observacionesBCD',
      sorter: (a, b) => a.observacionesBCD.localeCompare(b.observacionesBCD),
      sortOrder: sortedInfo.columnKey === 'observacionesBCD' ? sortedInfo.order : null,
      render: (_, record) => (
        <div>
          {updateStatus[record.id_item] && (
            <span style={{ color: updateStatus[record.id_item] === 'ok' ? 'green' : 'red' }}>
              {updateStatus[record.id_item] === 'ok' ? 'Actualización exitosa' : 'Error al actualizar'}
            </span>
          )}
          <Input
            placeholder='Observaciones'
            value={observacionInput[record.id_item] || ''}
            onBlur={() => handleObservacionesBlur(record.id_item)}
            onKeyDown={(e) => handleKeyPress(e, record.id_item)}
            onChange={(e) => handleObservacionesChange(record.id_item, e)}
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
    }
  ].map(col => ({
    ...col,
    onHeaderCell: () => ({
      style: { backgroundColor: '#f0f2f5' }
    }),
  }));

  const stateColorValue = {
    "Incidencia": 1,
    "Vehículo descargado": 2,
    "Vehículo pesado": 2,
    "Camión sin llegar": 4,
  };

  const sortedData = dataSource.sort((a, b) => {
    const colorA = stateColorValue[a.estado] || 5;
    const colorB = stateColorValue[b.estado] || 5;
    
    if (colorA !== colorB) {
      return colorA - colorB;
    }

    const dateA = a.hModificacion ? moment(a.hModificacion, 'HH:mm:ss') : moment(a.hPesado, 'HH:mm:ss');
    const dateB = b.hModificacion ? moment(b.hModificacion, 'HH:mm:ss') : moment(b.hPesado, 'HH:mm:ss');

    return dateA - dateB;
  });

  return (
    <div className="Table">
      <Table 
        dataSource={sortedData} 
        columns={columns} 
        pagination={false} 
        style={{ padding: "10px" }} 
        onChange={(pagination, filters, sorter) => setSortedInfo(sorter)}
      />
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
              <td>{selectedRowDetails?.observacionesDesc || 'Ninguna'}</td>
            </tr>
            <tr>
              <th>Observaciones de laboratorio</th>
              <td>{selectedRowDetails?.observacionesLab || 'Ninguna'}</td>
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