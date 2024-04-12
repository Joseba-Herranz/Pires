import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import { Layout, Menu } from 'antd';
//import 'antd/dist/antd.css';
import Table from './components/Bacula';
import Lab from './components/Laboratorio';
import Desc from './components/Descargador';
import logo from './pictures/LogoAgaleus_ico.svg';


const { Header, Content } = Layout;

const HeaderComponent = () => {
  const localizacion = useLocation();

  const getPagina = (pagina) => {
    switch (pagina) {
      case '/':
        return '1';
      case '/lab':
        return '3';
      case '/desc':
        return '5';
      default:
        return '1';
    }
  }

  return (
    <Header>
      <Menu theme="dark" mode="horizontal" selectedKeys={[getPagina(localizacion.pathname)]} style={{ backgroundColor: '#005157' }}>
        <Menu.Item key="0" style={{ paddingLeft: '0' }}>
          <img src={logo} alt="Logo" className="logo" />
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/">Bascula</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/lab">Laboratorio</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/desc">Descargador</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
}


function App() {
  return (
    <Router>
      <Layout>
        <HeaderComponent />
        <Content>
          <div>
            <Routes>
              <Route path='/' element={<Table />} />
              <Route path='/lab' element={<Lab />} />
              <Route path='/desc' element={<Desc />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;