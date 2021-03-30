/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import { FormHandles } from '@unform/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { useHistory } from 'react-router';
import { FiLogOut, FiXCircle } from 'react-icons/fi';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoMaintenanceImg from '../../assets/logoMaintenance.svg';

import getValidationErrors from '../../utils/getValidationErrors';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

// import Input from '../Input';
import InputHeader from '../InputHeader';

import {
  Container,
  LogoContainer,
  StyledLink,
  LogoutContainer,
  FormContainer,
  RoomsContainer,
  TitleContainer,
} from './styles';

interface EquipmentFormData {
  tomboSearch: string;
}

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
  room_id: string;
  created_at: Date;
  updated_at: Date;
}

const Header: React.FC = () => {
  const [maintenanceId, setMaintenanceId] = useState('');
  // const [inputError, setInputError] = useState('');
  // const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [maintenancesSearch, setMaintenancesSearch] = useState<Maintenance[]>(
    [],
  );

  const { signOut } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  const history = useHistory();
  useEffect(() => {
    api
      .get('/equipments', { headers: { Authorization: AuthStr } })
      .then((response) => {
        setEquipments(response.data);
      });
  }, [maintenanceId]);

  const removeMaintenance = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/maintenances/delete/${id}`, {
          headers: { Authorization: AuthStr },
        });

        const findMaintenance = maintenancesSearch.findIndex(
          (maintenance) => maintenance.id === id,
        );

        const listMaintenances = [...maintenancesSearch];

        listMaintenances.splice(findMaintenance, 1);

        setMaintenancesSearch(listMaintenances);

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
    [addToast, maintenancesSearch],
  );

  const handleSearch = useCallback(
    async (data: EquipmentFormData) => {
      try {
        formRef.current?.setErrors({});

        if (data.tomboSearch === '') {
          history.push('/');
        }

        const response = await api.get(
          `/maintenances/search/${data.tomboSearch}`,
          {
            headers: { Authorization: AuthStr },
          },
        );

        const findMintenances = response.data;

        if (findMintenances.length !== 0) {
          addToast({
            type: 'success',
            title: 'Manutenção encontrada!',
          });
        } else {
          addToast({
            type: 'error',
            title: 'Nenhuma manutenção encontrada',
          });
        }

        setMaintenancesSearch(findMintenances);
        setMaintenanceId('');

        window.scrollTo(0, 0);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Nenhuma manutenção encontrada',
        });
      }
    },
    [addToast, maintenancesSearch],
  );

  return (
    <>
      {/* <img src={logoImg} alt="Github Explorer" /> */}
      <Container>
        <StyledLink to="/dashboard">
          <LogoContainer>
            <img src={logoMaintenanceImg} alt="logo dashboard maintenance" />
            <h1>Controle de Manutenções</h1>
          </LogoContainer>
        </StyledLink>

        <FormContainer>
          <Form ref={formRef} onSubmit={handleSearch}>
            <InputHeader
              name="tomboSearch"
              list="equipments"
              placeholder="Pesquise as manutenções pelo tombo do equipamento..."
              value={maintenanceId}
              onChange={(e) => setMaintenanceId(e.target.value)}
            />

            <datalist id="equipments">
              {equipments.map((equipment) => (
                <option key={equipment.id} value={equipment.tombo}>
                  {/* {maintenance.titleMaintenance} */}
                </option>
              ))}
            </datalist>

            <button type="submit">Pesquisar</button>
          </Form>
        </FormContainer>

        <StyledLink to="/" onClick={signOut}>
          <LogoutContainer>
            <p>sair</p>
            <FiLogOut size={65} />
          </LogoutContainer>
        </StyledLink>
      </Container>

      {maintenancesSearch.length !== 0 && (
        <>
          <TitleContainer>
            <div className="title">
              <h1>Manutenções Encontradas</h1>
            </div>
          </TitleContainer>
          {maintenancesSearch.map((maintenance) => (
            <RoomsContainer key={maintenance.id}>
              <div>
                <strong className="nameRoom">
                  {maintenance.titleMaintenance}
                </strong>
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
                    <Link
                      to={`/dashboard/maintenance/update/${maintenance.id}`}
                    >
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
      )}
    </>
  );
};

export default Header;
