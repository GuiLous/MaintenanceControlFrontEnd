/* eslint-disable import/no-duplicates */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { FiArrowLeft, FiXCircle } from 'react-icons/fi';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
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

  const [selectedDate, setSelecetedDate] = useState(new Date());

  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');
  const FORMAT = 'dd/MM/yyyy';

  useEffect(() => {
    api
      .get('/maintenances', { headers: { Authorization: AuthStr } })
      .then((response) => {
        setMaintenances(response.data);
      });
    api
      .get('/equipments', { headers: { Authorization: AuthStr } })
      .then((response) => {
        setEquipments(response.data);
      });
  }, [equipmentTombo, selectedDate]);

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

  const removeMaintenance = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/maintenances/delete/${id}`, {
          headers: { Authorization: AuthStr },
        });

        const findMaintenance = maintenances.findIndex(
          (maintenance) => maintenance.id === id,
        );

        const listMaintenances = [...maintenances];

        listMaintenances.splice(findMaintenance, 1);

        setMaintenances(listMaintenances);

        addToast({
          type: 'success',
          title: 'Manutenção Excluida!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao exlcuir manutenção',
          description:
            'Ocorreu um erro ao tentar excluir a manutenção, tente novamente.',
        });
      }
    },
    [addToast, maintenances],
  );

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

        const response = await api.post<Maintenance>('/maintenances', data, {
          headers: { Authorization: AuthStr },
        });

        const maintenance = response.data;

        addToast({
          type: 'success',
          title: 'Manutenção adicionada!',
        });

        setMaintenances([...maintenances, maintenance]);
        setNewTitleMaintenance('');
        setNewDescription('');
        setNewResponsible('');
        setEquipmentTombo('');
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
    [addToast, maintenances],
  );

  return (
    <>
      <Header />
      <BackButton>
        <Link to="/dashboard">
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Nova Manutenção </h1>

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

          <strong className="nameRoom">Tombo do equipamento</strong>
          <Input
            name="tombo"
            list="equipments"
            placeholder="Tombo do Equipamento..."
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
              placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
              value={selectedDate}
              onDayChange={(e) => setSelecetedDate(e)}
            />
          </div>
          <Button type="submit">Cadastrar</Button>
        </Form>
      </FormContainer>

      {maintenances.length === 0 && (
        <RoomsContainer>
          <div>
            <strong className="nameRoom">Opps!</strong>
            <p id="empity">Nenhuma manutenção foi encontrada.</p>
          </div>
        </RoomsContainer>
      )}

      {equipments.length === 0 && (
        <RoomsContainer>
          <div>
            <strong className="nameRoom">
              Obs: Você não tem nenhum equipamento cadastrado!
            </strong>
            <p id="empity">
              Para cadastrar novas manutenções é necessário um equipamento.
            </p>
          </div>
        </RoomsContainer>
      )}

      {maintenances.map((maintenance) => (
        <RoomsContainer key={maintenance.id}>
          <div>
            <strong className="nameRoom">{maintenance.titleMaintenance}</strong>
            <div>
              <p>
                <strong>ID:</strong> {maintenance.id}
              </p>
              <p>
                <strong>Descrição:</strong> {maintenance.description}
              </p>
              <p>
                <strong>Responsável:</strong>
                {maintenance.responsibleMaintenance}
              </p>
              <p>
                <strong>Equipamento ID:</strong> {maintenance.equipment_id}
              </p>
              <p>
                <strong>Data da Manutenção:</strong> {maintenance.date}
              </p>
              <p>
                <strong>Criado em:</strong> {maintenance.created_at}
              </p>
              <p>
                <strong>Atualizado em:</strong> {maintenance.updated_at}
              </p>
              <div className="buttonContainer">
                <Link to={`/dashboard/maintenance/update/${maintenance.id}`}>
                  <button className="editorButton" type="button">
                    Editar
                  </button>
                </Link>
                <Link
                  to={`/dashboard/maintenance/equipment/${maintenance.equipment_id}`}
                >
                  <button className="editorButton" type="button">
                    Ver Equipamento
                  </button>
                </Link>
              </div>
            </div>

            <button
              id="remove"
              type="button"
              onClick={() => removeMaintenance(maintenance.id)}
            >
              excluir
              <FiXCircle size={30} />
            </button>
          </div>
        </RoomsContainer>
      ))}
    </>
  );
};

export default Maintenance;
