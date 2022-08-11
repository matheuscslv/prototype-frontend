import React, { useRef, useCallback } from 'react';
import { Form } from '@unform/web';

import {
  FormGroup, Button,
} from 'reactstrap';

import * as Yup from 'yup';

import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';

const Login = () => {
  const formRef = useRef<any>(null);

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
          password: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        console.log(data);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [],
  );

  return (
    <Form
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <div style={{ margin: 'auto', width: '50%', marginTop: '10%' }}>
        <FormGroup>
          <Input
            name="email"
            placeholder="Email"
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="password"
            placeholder="Password"
            type="password"
          />
        </FormGroup>
        <Button>
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default Login;
