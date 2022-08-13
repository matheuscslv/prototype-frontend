import React, { useState, useCallback, useRef } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useUnit } from '../../hooks/unit';
import { useFunction } from '../../hooks/function';

import Input from "../Input";
import getValidationErrors from '../../utils/getValidationErrors';
import Modal from "../Modal";

const Table = () => {
  const {
    units, deleteUnit, updateUnit,
  } = useUnit();

  const { functions } = useFunction();

  const formRef = useRef<any>(null);

  const [isUnitUpdate, setIsUnitUpdate] = useState<any>(null);
  const [open, setOpen] = useState(false);

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

        updateUnit({ ...isUnitUpdate, ...data });

        setIsUnitUpdate(null);
        setOpen(false);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [updateUnit, isUnitUpdate],
  );

  return (
    <>
      <table>
        <tr>
          <th>
            id
          </th>
          <th>
            Sigla
          </th>
          <th>
            Nome
          </th>
          <th>
            Função
          </th>
          <th>Ação</th>
        </tr>
        <tbody>
          {units.map((item) => (
            <tr>
              <th>
                {item.id}
              </th>
              <th>
                {item.sigla}
              </th>
              <td>
                {item.nome}
              </td>
              <td>
                {item.funcao}
              </td>
              <td>
                <button
                  onClick={() => {
                    setIsUnitUpdate(item);
                    setOpen(true);
                  }}
                  type="button"
                >
                  Atualizar unidade
                </button>
                <button onClick={() => deleteUnit(item.id)} type="button">
                  Remover unidade
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={open} setOpen={setOpen}>
        <button onClick={() => { setOpen(false); }}>Fechar</button>

        <div style={{ margin: 'auto', width: '50%', marginTop: '10%' }}>
          <Form
            ref={formRef}
            initialData={isUnitUpdate}
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
            <Input
              format="select"
              options={functions}
              name="funcao"
            />

            <button>
              Atualizar
            </button>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default Table;
