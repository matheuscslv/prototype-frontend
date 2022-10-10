import React, { useRef, useCallback, useState } from 'react';
import { Form } from '@unform/web';

import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, { Calendar } from '@hassanmojab/react-modern-calendar-datepicker';

import {
  FormGroup, Button, Table,
} from 'reactstrap';

import Modal from 'react-modal';

import * as Yup from 'yup';

import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';

interface IUnit {
  id: string;
  sigla: string;
  unidade: string;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#yourAppElement');

const Login = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [ErrorValor, setErrorValor] = useState("");
  const [valor, setValor] = useState(0);
  const [modelos, setModelos] = useState<any>([]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const formRef = useRef<any>(null);

  const [units, setUnits] = useState<IUnit[]>([]);

  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null,
  });

  const [selectedDay, setSelectedDay] = useState(null);

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          sigla: Yup.string().required('Campo obrigatório'),
          unidade: Yup.string().required('Campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setUnits([...units, { id: Date.now(), ...data }]);
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [units],
  );

  React.useEffect(() => {
    console.log(selectedDayRange);
  }, [selectedDayRange]);

  React.useEffect(() => {
    console.log(selectedDay);
  }, [selectedDay]);

  React.useEffect(() => {
    const aux = modelos.reduce(
      (previousValue: any, currentValue: any) => previousValue + Number(currentValue.valor),
      0,
    );
    if (aux > valor) {
      setErrorValor('ultrapassou valor');
    } else {
      setErrorValor("");
    }
  }, [modelos]);

  return (
    <>
      <Calendar
        value={selectedDayRange}
        // @ts-ignore
        onChange={setSelectedDayRange}
        shouldHighlightWeekends
      />

      <DatePicker
        value={selectedDay}
        // @ts-ignore
        onChange={setSelectedDay}
        inputPlaceholder="Select a day"
        shouldHighlightWeekends
      />

      <div style={{ marginTop: 150 }}>
        <input
          type="text"
          onChange={(e) => setValor(Number(e.target.value))}
        />
        {ErrorValor && <span>{ErrorValor}</span>}
        <br />
        {modelos.map((item: any) => (
          <>
            <input
              type="number"
              value={item.valor}
              onChange={(e) => {
                setModelos(modelos.map((subitem: any) => (subitem.id == item.id ? ({ ...subitem, valor: Number(e.target.value) }) : subitem)));
              }}
            />
            <br />
          </>

        ))}

        <button
          type="button"
          onClick={() => {
            setModelos([...modelos, {
              id: Date.now(),
              valor: 0,
            }]);
          }}
        >
          Adicionar

        </button>

        <button
          type="button"
          onClick={() => {
            const aux = modelos.reduce(
              (previousValue: any, currentValue: any) => previousValue + Number(currentValue.valor),
              0,
            );
            if (aux > valor) {
              alert("Valores estão ultrapassando, verifique antes de submeter");
            }
          }}
        >
          Submeter
        </button>

      </div>

      <Form
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <div style={{ margin: 'auto', width: '50%', marginTop: '10%' }}>
          <FormGroup>
            <Input
              name="sigla"
              placeholder="Sigla"
              type="text"
            />
          </FormGroup>
          <FormGroup>
            <Input
              name="unidade"
              placeholder="Unidade"
              type="text"
            />
          </FormGroup>
          <Button>
            Salvar
          </Button>

          <Table>
            <thead>
              <tr>
                <th>
                  id
                </th>
                <th>
                  Sigla
                </th>
                <th>
                  Unidade
                </th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {units.map((item) => (
                <tr>
                  <th scope="row">
                    {item.id}
                  </th>
                  <th>
                    {item.sigla}
                  </th>
                  <td>
                    {item.unidade}
                  </td>
                  <td>
                    <Button onClick={openModal} type="button">
                      Adicionar Função
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

      </Form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
      </Modal>
    </>
  );
};

export default Login;
