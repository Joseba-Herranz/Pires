import React from 'react';
import { Input } from 'antd';

const Escribir = ({ onChange, value, placeholder }) => {
  return <Input value={value} onChange={onChange} placeholder={placeholder} />;
};

export default Escribir;