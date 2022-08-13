import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { cpf } from '../../utils/masks';

const Input = ({
  setValues, name, format, options, ...rest
}: any) => {
  const inputRef = useRef<any>(null);

  const {
    fieldName, defaultValue, error, registerField,
  } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <>
      {format === 'text' ? (
        <div>
          <input
            name={name}
            ref={inputRef}
            defaultValue={defaultValue}
            onChange={(e) => {
              if (name === 'cpf') {
                inputRef.current.value = cpf(e.target.value);
              } else {
                inputRef.current.value = e.target.value;
              }
            }}
            {...rest}
          />
          <sup style={{ color: '#c53030', marginTop: 5 }}>
            {error && error}
          </sup>
        </div>
      ) : format === 'select' && (
        <select
          defaultValue={defaultValue}
          ref={inputRef}
          onChange={(value) => {
            setValues(Array.from(value.target.options).filter((x) => x.selected).map((el) => el.value));
          }}
          name={name}
          {...rest}
        >
          {options.map((item: any) => (
            <option value={item.nome}>{item.nome}</option>
          ))}
        </select>
      )}
    </>

  );
};

export default Input;
