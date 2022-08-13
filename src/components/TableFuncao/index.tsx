import React, { useState, useCallback, useRef } from 'react';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useFunction } from '../../hooks/function';
import { useUnit } from '../../hooks/unit';

import Input from "../Input";
import getValidationErrors from '../../utils/getValidationErrors';
import Modal from "../Modal";

const TableFuncao = () => {
  const {
    functions, deleteFunction, updateFunction,
  } = useFunction();

  const { units } = useUnit();

  const [selectedUnits, setSelectedUnits] = useState<any>([]);

  const formRef = useRef<any>(null);

  const [isFunctionUpdate, setIsFunctionUpdate] = useState<any>(null);
  const [open, setOpen] = useState(false);

  function hasDuplicates(array: any) {
    return (new Set(array)).size !== array.length;
  }

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

        const array = [];
        functions.forEach((item) => array.push(...item.unidades.map((subtitem:any) => subtitem)));
        array.push(...selectedUnits.map((item:any) => item));

        if (hasDuplicates(array)) {
          alert('Uma das unidades selecionadas já tem função');
          return;
        }

        updateFunction({ ...isFunctionUpdate, ...data, unidades: selectedUnits });

        setIsFunctionUpdate(null);
        setOpen(false);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [updateFunction, functions, isFunctionUpdate, selectedUnits],
  );

  return (
    <>
      <table>
        <tr>
          <th>
            id
          </th>
          <th>
            Nome
          </th>
          <th>
            Unidades
          </th>
          <th>Ação</th>
        </tr>
        <tbody>
          {functions.map((item) => (
            <tr>
              <th>
                {item.id}
              </th>
              <td>
                {item.nome}
              </td>
              <td>
                {item.unidades.map((item) => item).join(',')}
              </td>
              <td>
                <button
                  onClick={() => {
                    setIsFunctionUpdate(item);
                    setOpen(true);
                  }}
                  type="button"
                >
                  Atualizar função
                </button>
                <button onClick={() => deleteFunction(item.id)} type="button">
                  Remover função
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
            initialData={isFunctionUpdate}
            onSubmit={handleSubmit}
          >
            <Input
              format="text"
              name="nome"
              placeholder="Nome"
              type="text"
            />
            <Input
              multiple
              setValues={setSelectedUnits}
              format="select"
              options={units}
              name="unidades"
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

export default TableFuncao;
