import React, { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import {
  Input as ReactInput,
} from 'reactstrap';

const Input = ({ name, ...rest }: any) => {
  const inputRef = useRef<any>(null);

  const {
    fieldName, defaultValue, error, registerField,
  } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => ref.current.value,
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = '';
      },
    });
  }, [fieldName, registerField]);

  return (
    <div>
      <ReactInput
        name={name}
        ref={inputRef}
        defaultValue={defaultValue}
        onChange={(e) => {
          inputRef.current.value = e.target.value;
        }}
        {...rest}
      />
      <sup style={{ color: '#c53030', marginTop: 5 }}>
        {error && error}
      </sup>
    </div>

  );
};
export default Input;
