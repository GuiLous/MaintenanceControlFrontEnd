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
import { RoomsContainer, FormContainer, BackButton } from './styles';

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
  tombo: string;
  date: Date;
}

const Maintenance: React.FC = () => {
  const [newTitleMaintenance, setNewTitleMaintenance] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newResponsible, setNewResponsible] = useState('');
  const [equipmentTombo, setEquipmentTombo] = useState('');

  const { id } = useParams<IParams>();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');
  const FORMAT = 'dd/MM/yyyy';

  const history = useHistory();
  useEffect(() => {
    api
      .get(`/maintenances/maintenance/${id}`, {
        headers: { Authorization: AuthStr },
      })
      .then((response) => {
        setNewTitleMaintenance(response.data.titleMaintenance);
        setNewDescription(response.data.description);
        setNewResponsible(response.data.responsibleMaintenance);
        setMaintenance(response.data);
      });
    api
      .get('/equipments', { headers: { Authorization: AuthStr } })
      .then((response) => {
        setEquipments(response.data);
      });
  }, []);

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
      // eslint-disable-next-line no-param-reassign
      data.date = selectedDate;
      try {
        formRef.current?.setErrors({});

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

        const response = await api.put<Maintenance>(
          `/maintenances/update/${id}`,
          data,
          {
            headers: { Authorization: AuthStr },
          },
        );

        const findMaintenance = response.data;

        addToast({
          type: 'success',
          title: 'Manutenção atualizada!',
        });

        setMaintenance(findMaintenance);
        setNewTitleMaintenance('');
        setNewDescription('');
        setNewResponsible('');
        setEquipmentTombo('');

        history.push('/dashboard/maintenances');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao atualizar a manutenção',
          description:
            'Ocorreu um erro ao tentar atualizar a manutenção, tente novamente.',
        });
      }
    },
    [addToast, maintenance, selectedDate],
  );

  return (
    <>
      <Header />
      <BackButton>
        <Link to="/dashboard/maintenances">
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Atualizar Manutenção </h1>

          <strong className="nameRoom">Título Manutenção</strong>
          <Input
            name="titleMaintenance"
            placeholder="Título da manutenção"
            value={newTitleMaintenance}
            onChange={(e) => setNewTitleMaintenance(e.target.value)}
          />

          <strong className="nameRoom">Descrição</strong>
          <Input
            name="description"
            placeholder="Descrição da manutenção"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />

          <strong className="nameRoom">Responsável</strong>
          <Input
            name="responsibleMaintenance"
            placeholder="Responsável pela manutenção"
            value={newResponsible}
            onChange={(e) => setNewResponsible(e.target.value)}
          />

          <strong className="nameRoom">Tombo do equipamento</strong>
          <Input
            name="tombo"
            list="equipments"
            placeholder="Tombo do Equipamento avaliado."
            value={equipmentTombo}
            onChange={(e) => setEquipmentTombo(e.target.value)}
          />

          <datalist id="equipments">
            {equipments.map((equipment) => (
              <option key={equipment.id} value={equipment.tombo}>
                {equipment.name}
              </option>
            ))}
          </datalist>

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

          <Button type="submit">Atualizar</Button>
        </Form>
      </FormContainer>

      {equipments.length === 0 && (
        <RoomsContainer>
          <div>
            <strong className="nameRoom">
              Obs: Você não tem nenhum equipamento cadastrado!
            </strong>
            <p id="empity">Para atualizar é necessário um equipamento.</p>
          </div>
        </RoomsContainer>
      )}
    </>
  );
};

export default Maintenance;
