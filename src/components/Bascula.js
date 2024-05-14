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
  const [updateStatus, setUpdateStatus] = useState({});
  const [originalData, setOriginalData] = useState([]);
  const naranja = ["Vehículo descargado", "Vehículo pesado"];

  const showModal = (record) => {
    const originalRecord = originalData.find(item => item.key === record.key);
    setSelectedRowDetails(originalRecord || record);
    console.log(originalRecord)
    //setText(record.observacionesBCD);
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
  // const handleObservacionesChange = (key, newObservaciones) => {
  //   const newData = dataSource.map(item => {
  //     if (item.key === key) {
  //       return { ...item, observacionesBCD: newObservaciones };
  //     }
  //     return item;
  //   });
  //   setDataSource(newData);
  // };

  const [observacionInput, setObservacionInput] = useState({});

  const handleObservacionesChange = (id, event) => {
    setObservacionInput(prev => ({ ...prev, [id]: event.target.value }));
    console.log("handleObservacionesChange:", id, event.target.value);
  };

  const handleObservacionesBlur = (id) => {
    // Solo actualizamos si el input aún tiene valor, evitando dobles llamadas
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
            { ...prevState[index], observacionesBCD: observacionInput[id] }, // Corrección aquí
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
  
  
 

  const [dataSource, setDataSource] = useState([]);

  /*const loadData = () => {
    axios.get('http://52.214.60.157:8080/api/cabecera/relacion')
      .then(response => {
        console.log(response.data);
        const dataSource = response.data.cabeza.map(item => ({
          key: item.id.toString(),
          id_item: item.lineas && item.lineas.length > 0 ? item.lineas[0].id : '',
          nPedido: item.id_navision,
          name: item.venta_nombre,
          hPesado: moment.utc(item.hora_pesado_bruto).format("HH:mm:ss"),
          pBruto: item.peso_bruto,
          nMatricula: item.n_matricula,
          nomConductor: item.nombre_conductor,
          observacionesTrans: item.observacionesTrans || '',
          
          descripcion: item.lineas && item.lineas.length > 0 ? item.lineas[0].descripcion : '',
          pDescarga: traductor(item.lineas && item.lineas.length > 0 ? item.lineas[0].codigo_almacen : ''),
          cantidad: item.lineas && item.lineas.length > 0 ? item.lineas[0].cantidad : '',
          observacionesDesc: item.lineas && item.lineas.length > 0 ? item.lineas[0].observacionesDesc : '',
          observacionesLab: item.lineas && item.lineas.length > 0 ? item.lineas[0].observaciones_laboratorio_bascula || '' : '',
          //observacionesBCD: item.lineas && item.lineas.length > 0 ? item.lineas[0].observaciones_bascula_camion_descarga || '' : '',
          observacionesBCD: item.lineas && item.lineas.length > 0 && item.lineas[0].observaciones_bascula_camion_descarga ? item.lineas[0].observaciones_bascula_camion_descarga : '',

          estado: item.lineas && item.lineas.length > 0 && item.lineas[0].estado !== null ? item.lineas[0].estado : 'Camión sin llegar',
        }));
        console.log(dataSource);
        setDataSource(dataSource);
        setOriginalData(dataSource);
      })
      .catch(error => console.error('There was an error getting the data:', error));
  }*/

  const loadData = () => {
    axios.get('http://52.214.60.157:8080/api/cabecera/relacion')
      .then(response => {
        console.log(response.data);
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
              //estado: linea.estadoAsociado ? linea.estadoAsociado.descripcion : 'Camión sin llegar',
              estado: linea.estado !== null ? linea.estado : 'Camión sin llegar',
                        estadoActual: linea.estadoAsociado.descripcion,
                        estadosRelacion: linea.estadoAsociado.estados_rel,
            });
          });
        });
        console.log(dataSource);
        setDataSource(dataSource);
        setOriginalData(dataSource);
      })
      .catch(error => console.error('There was an error getting the data:', error));
  }
  
  useEffect(() => {
    loadData();
  }, []);

  const columns = () => ([
    {
      title: 'Nº Pedido',
      dataIndex: 'nPedido',
      key: 'nPedido',
      //filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.nPedido.startsWith(value),
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
          estadoNum={record.estado}
          estadoInicial={record.estadoActual}
          estadosRelacion={record.estadosRelacion}
          onEstadoChange={handleChange}
          recordKey={record.id_item}
          loadData={loadData}
          tipo={1}
        />

        // <Seleccion
        //   estadoInicial={record.estado ? record.estado : text}
        //   onEstadoChange={handleChange}
        //   recordKey={record.key}
        //   naranja={naranja}
        //   tipo={1}
        // />
      ),
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
        placeholder='Observaciones'
        value={observacionInput[record.id_item] || ''}
        onBlur={() => handleObservacionesBlur(record.id_item)}
        onKeyDown={(e) => handleKeyPress(e, record.id_item)}
        onChange={(e) => handleObservacionesChange(record.id_item, e)}
      />
    
        </div>
        /*<Escribir
          // value={record.observacionesBCD}
          // onChange={e => handleObservacionesChange(record.key, e.target.value, 'observacionesBCD')}
          // placeholder={'Observaciones'}
          value={observacionInput[record.id_item] || record.observacionesBCD}
          onChange={e => handleObservacionesChange(record.id_item, e)}
          onBlur={() => handleObservacionesBlur(record.id_item)}
          placeholder={'Observaciones'}
        />*/
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

    const dateA = moment(a.hPesado, 'HH:mm:ss').format("HH:mm:ss");
    const dateB = moment(b.hPesado, 'HH:mm:ss').format("HH:mm:ss");
    return dateA - dateB;
  });

  return (
    <div className="Table">
      <Table dataSource={sortedData} columns={columns()} pagination={false} style={{ padding: "10px" }} />
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