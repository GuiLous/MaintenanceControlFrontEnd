/* eslint-disable import/no-duplicates */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { FiArrowLeft } from 'react-icons/fi';
import { DateUtils } from 'react-day-picker';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/button';

import 'react-day-picker/lib/style.css';
import { FormContainer, BackButton } from './styles';

import getValidationErrors from '../../utils/getValidationErrors';

interface Maintenance {
  id: string;
  titleMaintenance: string;
  description: string;
  responsibleMaintenance: string;
  equipment_id: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
}

interface Equipment {
  id: string;
  name: string;
  tombo: string;
}

interface IParams {
  id: string;
}

interface MaintenanceFormData {
  titleMaintenance: string;
  description: string;
  responsibleMaintenance: string;
  tombo: string | undefined;
  date: Date;
}

const CreateMaintenance: React.FC = () => {
  const { id } = useParams<IParams>();

  const [newTitleMaintenance, setNewTitleMaintenance] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newResponsible, setNewResponsible] = useState('');

  const [equip, setEquip] = useState<Equipment | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');
  const FORMAT = 'dd/MM/yyyy';

  const history = useHistory();
  useEffect(() => {
    api
      .get(`/equipments/equipment/${id}`, {
        headers: { Authorization: AuthStr },
      })
      .then((response) => {
        setEquip(response.data);
      });
  }, [selectedDate]);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function parseDate(str: string, format: string, locale: any) {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function formatDate(date: number | Date, format: string, locale: any) {
    return dateFnsFormat(date, format, { locale });
  }

  const handleSubmit = useCallback(
    async (data: MaintenanceFormData) => {
      try {
        formRef.current?.setErrors({});

        // eslint-disable-next-line no-param-reassign
        data.date = selectedDate;
        // eslint-disable-next-line no-param-reassign
        data.tombo = equip?.tombo;

        const schema = Yup.object().shape({
          titleMaintenance: Yup.string().required(
            'Titulo da manutenção obrigatório',
          ),
          description: Yup.string().required('Descrição obrigatória'),
          responsibleMaintenance: Yup.string().required(
            'Responsável obrigatório',
          ),
          tombo: Yup.string().required('Equipamento obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post<Maintenance>('/maintenances', data, {
          headers: { Authorization: AuthStr },
        });

        addToast({
          type: 'success',
          title: 'Manutenção adicionada!',
        });

        setNewTitleMaintenance('');
        setNewDescription('');
        setNewResponsible('');
        history.push(`/dashboard/equipment/maintenances/${equip?.id}`);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao cadrastar manutenção',
          description:
            'Ocorreu um erro ao tentar cadastrar a manutenção, tente novamente.',
        });
      }
    },
    [addToast, equip],
  );

  return (
    <>
      <Header />
      <BackButton>
        <Link to={`/dashboard/equipment/maintenances/${equip?.id}`}>
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>
            Vincular Manutenção a {equip?.name} #{equip?.tombo}
          </h1>

          <strong className="nameRoom">Título Manutenção</strong>
          <Input
            name="titleMaintenance"
            placeholder="Título da manutenção..."
            value={newTitleMaintenance}
            onChange={(e) => setNewTitleMaintenance(e.target.value)}
          />

          <strong className="nameRoom">Descrição</strong>
          <Input
            name="description"
            placeholder="Descrição da manutenção..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />

          <strong className="nameRoom">Responsável</strong>
          <Input
            name="responsibleMaintenance"
            placeholder="Responsável pela manutenção..."
            value={newResponsible}
            onChange={(e) => setNewResponsible(e.target.value)}
          />

          <div className="StyledDayPickerInput">
            <strong className="nameRoom">Data: </strong>
            <DayPickerInput
              formatDate={formatDate}
              format={FORMAT}
              parseDate={parseDate}
              value={selectedDate}
              onDayChange={(e) => setSelectedDate(e)}
            />
          </div>

          <Button type="submit">Criar</Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default CreateMaintenance;
