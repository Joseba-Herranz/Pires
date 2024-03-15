import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
//import 'antd/dist/antd.css';
import Table from './components/Bacula';
import Table2 from './components/BasculaCompleta';
import Lab from './components/LaboratorioCompleto';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ backgroundColor: '#005157' }}>
            {/* <Menu.Item key="0">
              <img src="./pictures/LogoAgaleus_ico.svg" alt="Logo"/>
            </Menu.Item> */}
            <Menu.Item key="1">
              <Link to="/">Bascula</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/table2">Bascula completa</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/lab">Laboratorio completa</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content>
          <div>
            <Routes>
              <Route path='/' element={<Table />} />
              <Route path='/table2' element={<Table2 />} />
              <Route path='/lab' element={<Lab />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;