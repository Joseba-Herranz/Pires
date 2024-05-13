import React from 'react';
import { Input } from 'antd';

const Escribir = ({ defaultValue, className, onChange, onBlur, value, placeholder }) => {
  return <Input defaultValue={defaultValue} className={className} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} />;
};

export default Escribir;