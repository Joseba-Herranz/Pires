import React, { useState } from 'react';
import { Select } from 'antd';

const DescLab = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (value) => {
    setSelectedOption(value);
  }

  return (
    <Select
      value={selectedOption}
      onChange={handleChange}
      placeholder="Por favor selecciona una opción"
    >
      <Select.Option value="Filtro">Filtro</Select.Option>
      <Select.Option value="Acumulador">Acumulador</Select.Option>
      <Select.Option value="DAF">DAF</Select.Option>
      <Select.Option value="Torre">Torre</Select.Option>
      <Select.Option value="Destruir">Destruir</Select.Option>
      <Select.Option value="Fabricar">Fabricar</Select.Option>
      <Select.Option value="Férrico">Férrico</Select.Option>
      <Select.Option value="A destruir o filtro con Cal">A destruir o filtro con Cal</Select.Option>
      <Select.Option value="ITP">ITP</Select.Option>
      <Select.Option value="Destruir (Cromo) o filtro con ferroso">Destruir (Cromo) o filtro con ferroso</Select.Option>
      <Select.Option value="B4. Siempre dice B4 y">B4. Siempre dice B4 y</Select.Option>
      <Select.Option value="B7">B7</Select.Option>
      <Select.Option value="Inertizar">Inertizar</Select.Option>
      <Select.Option value="Carpa">Carpa</Select.Option>
      <Select.Option value="Filtro/B4">Filtro/B4</Select.Option>
      <Select.Option value="Filtro/Inertizar">Filtro/Inertizar</Select.Option>
      <Select.Option value="Filtro/B4/Inertizar">Filtro/B4/Inertizar</Select.Option>
      <Select.Option value="B4/Inertizar">B4/Inertizar</Select.Option>
    </Select>
  );
}

export default DescLab;
