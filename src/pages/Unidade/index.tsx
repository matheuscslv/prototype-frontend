import React, { useRef, useCallback } from 'react';
import { Form } from '@unform/web';

import * as Yup from 'yup';

import Header from '../../components/Header';
import Input from '../../components/Input';
import TableUnidade from '../../components/TableUnidade';
import getValidationErrors from '../../utils/getValidationErrors';

import { useUnit } from '../../hooks/unit';

const Home = () => {
  const {
    addUnit,
  } = useUnit();

  const formRef = useRef<any>(null);

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          sigla: Yup.string().required('Campo obrigatório').min(2, 'Mínino de 2 caracteres'),
          nome: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        addUnit({ id: Date.now(), ...data });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [addUnit],
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
            name="sigla"
            placeholder="Sigla"
            type="text"
          />
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

        <TableUnidade />
      </div>
    </>
  );
};

export default Home;
