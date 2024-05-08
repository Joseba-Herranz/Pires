import React from 'react';
import { Input } from 'antd';

const Escribir = ({ onChange, onBlur, value, placeholder }) => {
  return <Input value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} />;
};

export default Escribir;
