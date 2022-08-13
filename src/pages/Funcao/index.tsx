import React, { useRef, useCallback } from 'react';
import { Form } from '@unform/web';

import * as Yup from 'yup';

import Header from '../../components/Header';
import Input from '../../components/Input';
import TableFuncao from '../../components/TableFuncao';
import getValidationErrors from '../../utils/getValidationErrors';

import { useFunction } from '../../hooks/function';

const Funcao = () => {
  const {
    addFunction,
  } = useFunction();

  const formRef = useRef<any>(null);

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          nome: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        addFunction({ id: Date.now(), ...data, unidades: [] });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [addFunction],
  );

  return (
    <>
      <Header />
      <div style={{ margin: 'auto', width: '50%', marginTop: '10%' }}>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <Input
            format="text"
            name="nome"
            placeholder="Nome"
            type="text"
          />
          <button>
            Adicionar
          </button>
        </Form>

        <TableFuncao />
      </div>
    </>
  );
};

export default Funcao;
