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

interface Equipment {
  id: string;
  name: string;
  tombo: string;
  room_id: string;
  created_at: Date;
  updated_at: Date;
}

const Header: React.FC = () => {
  const [equipmentId, setEquipmentId] = useState('');
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [equipmentsSearch, setEquipmentsSearch] = useState<Equipment[]>([]);

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
  }, [equipmentId]);

  const removeEquipment = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/equipments/delete/${id}`, {
          headers: { Authorization: AuthStr },
        });

        const findEquipment = equipmentsSearch.findIndex(
          (equipment) => equipment.id === id,
        );

        const listEquipments = [...equipmentsSearch];

        listEquipments.splice(findEquipment, 1);

        setEquipmentsSearch(listEquipments);

        addToast({
          type: 'success',
          title: 'Equipamento Excluido!',
        });
        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao excluir equipamento',
          description:
            'Ocorreu um erro ao tentar excluir o equipamento, tente novamente.',
        });
      }
    },
    [addToast, equipmentsSearch],
  );

  const handleSearch = useCallback(
    async (data: EquipmentFormData) => {
      try {
        formRef.current?.setErrors({});

        if (data.tomboSearch === '') {
          history.push('/dashboard/equipments');
        }

        const response = await api.get(
          `/equipments/search/${data.tomboSearch}`,
          {
            headers: { Authorization: AuthStr },
          },
        );

        const findEquipments = response.data;
        if (findEquipments.length !== 0) {
          addToast({
            type: 'success',
            title: 'Equipamento encontrado!',
          });
        } else {
          addToast({
            type: 'error',
            title: 'Nenhum equipamento encontrado!',
          });
        }

        setEquipmentsSearch(findEquipments);
        setEquipmentId('');

        window.scrollTo(0, 0);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Nenhum equipamento encontrada!',
        });
      }
    },
    [addToast, equipmentsSearch],
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
              placeholder="Pesquise pelo tombo do equipamento..."
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
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

      {equipmentsSearch.length !== 0 && (
        <>
          <TitleContainer>
            <div className="title">
              <h1>Equipamentos Encontrados</h1>
            </div>
          </TitleContainer>
          {equipmentsSearch.map((equipment) => (
            <RoomsContainer key={equipment.id}>
              <div>
                <strong className="nameRoom">{equipment.name}</strong>
                <div>
                  <p>
                    <strong>ID:</strong> {equipment.id}
                  </p>
                  <p>
                    <strong>Tombo:</strong> {equipment.tombo}
                  </p>
                  <p>
                    <strong>Room_Id:</strong> {equipment.room_id}
                  </p>
                  <p>
                    <strong>Criado em:</strong> {equipment.created_at}
                  </p>
                  <p>
                    <strong>Atualizado em:</strong> {equipment.updated_at}
                  </p>
                  <div className="buttonContainer">
                    <Link to={`/dashboard/equipment/update/${equipment.id}`}>
                      <button className="editorButton" type="button">
                        Editar
                      </button>
                    </Link>
                    <Link
                      to={`/dashboard/equipment/maintenances/${equipment.id}`}
                    >
                      <button className="editorButton" type="button">
                        Ver Manutenções
                      </button>
                    </Link>
                  </div>
                </div>

                <button
                  id="remove"
                  type="button"
                  onClick={() => removeEquipment(equipment.id)}
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
