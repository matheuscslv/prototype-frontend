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

const myCustomLocale = {
  // months list by order
  months: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],

  // week days by order
  weekDays: [
    {
      name: 'Domingo', // used for accessibility
      short: 'Dom', // displayed at the top of days' rows
      isWeekend: true, // is it a formal weekend or not?
    },
    {
      name: 'Segunda-feira',
      short: 'Seg',
    },
    {
      name: 'Terça-feira',
      short: 'Ter',
    },
    {
      name: 'Quarta-feira',
      short: 'Qua',
    },
    {
      name: 'Quinta-feira',
      short: 'Qui',
    },
    {
      name: 'Sexta-feira',
      short: 'Sex',
    },
    {
      name: 'Sábado',
      short: 'Sab',
      isWeekend: true,
    },
  ],

  // just play around with this number between 0 and 6
  weekStartingIndex: 0,

  // return a { year: number, month: number, day: number } object
  getToday(gregorainTodayObject: any) {
    return gregorainTodayObject;
  },

  // return a native JavaScript date here
  toNativeDate(date: any) {
    return new Date(date.year, date.month - 1, date.day);
  },

  // return a number for date's month length
  getMonthLength(date: any) {
    return new Date(date.year, date.month, 0).getDate();
  },

  // return a transformed digit to your locale
  transformDigit(digit: any) {
    return digit;
  },

  // texts in the date picker
  nextMonth: 'Próximo mês',
  previousMonth: 'Mês anterior',
  openMonthSelector: 'Seletor de mês aberto',
  openYearSelector: 'Seletor de ano aberto',
  closeMonthSelector: 'Fechar seletor de mês',
  closeYearSelector: 'Fechar seletor de ano',
  defaultPlaceholder: 'Selecione...',

  // for input range value
  from: 'de',
  to: 'para',

  // used for input value when multi dates are selected
  digitSeparator: ',',

  // if your provide -2 for example, year will be 2 digited
  yearLetterSkip: 0,

  // is your language rtl or ltr?
  isRtl: false,
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

  const [selectedDay, setSelectedDay] = useState<any>(null);

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

  const formatInputValue = () => {
    if (!selectedDay) return '';
    return `${selectedDay.day}/${selectedDay.month}/${selectedDay.year}`;
  };

  return (
    <>
      <Calendar
        value={selectedDayRange}
        // @ts-ignore
        onChange={setSelectedDayRange}
        shouldHighlightWeekends
        locale={myCustomLocale}
      />

      <DatePicker
        value={selectedDay}
        // @ts-ignore
        onChange={setSelectedDay}
        inputPlaceholder="Selecione o dia"
        shouldHighlightWeekends
        formatInputText={formatInputValue}
        locale={myCustomLocale}
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
