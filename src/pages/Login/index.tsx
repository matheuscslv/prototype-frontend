import React, { useRef, useCallback } from 'react';
import { Form } from '@unform/web';

import * as Yup from 'yup';

import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';

import { useAuth } from '../../hooks/auth';

const Login = () => {
  const { signIn } = useAuth();

  const formRef = useRef<any>(null);

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          cpf: Yup.string().required('Campo obrigatório'),
          password: Yup.string().required('Campo obrigatório').min(6, 'Mínimo de 6 caracteres'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        signIn(data);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [signIn],
  );

  return (
    <>
      <Form
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <div style={{ margin: 'auto', width: '50%', marginTop: '10%' }}>
          <h1>Autenticação</h1>
          <Input
            format="text"
            name="cpf"
            placeholder="CPF"
            type="text"
            maxLength={14}
          />
          <Input
            format="text"
            name="password"
            placeholder="senha"
            type="password"
          />
          <button>
            Entrar
          </button>
        </div>
      </Form>
    </>
  );
};

export default Login;
