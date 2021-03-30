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

interface RoomFormDataSearch {
  nameSearch: string;
}

interface Room {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

const Header: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsSearch, setRoomsSearch] = useState<Room[]>([]);

  const { signOut } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  const history = useHistory();
  useEffect(() => {
    api
      .get('/rooms', { headers: { Authorization: AuthStr } })
      .then((response) => {
        setRooms(response.data);
      });
  }, [roomId]);

  const removeRoom = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/rooms/delete/${id}`, {
          headers: { Authorization: AuthStr },
        });

        const findRoom = roomsSearch.findIndex((room) => room.id === id);

        const listRooms = [...roomsSearch];

        listRooms.splice(findRoom, 1);

        setRoomsSearch(listRooms);

        addToast({
          type: 'success',
          title: 'Sala Excluida!',
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
          title: 'Erro ao exlcuir sala',
          description:
            'Ocorreu um erro ao tentar excluir a sala, tente novamente.',
        });
      }
    },
    [addToast, roomsSearch],
  );

  const handleSearch = useCallback(
    async (data: RoomFormDataSearch) => {
      try {
        formRef.current?.setErrors({});

        if (data.nameSearch === '') {
          history.push('/dashboard/rooms');
        }

        const response = await api.get(`/rooms/search/${data.nameSearch}`, {
          headers: { Authorization: AuthStr },
        });

        const findRooms = response.data;
        console.log(findRooms);

        if (findRooms.length !== 0) {
          addToast({
            type: 'success',
            title: 'Sala encontrada!',
          });
        } else {
          addToast({
            type: 'error',
            title: 'Nenhuma sala encontrada com esse nome',
          });
        }

        setRoomsSearch(findRooms);
        setRoomId('');

        window.scrollTo(0, 0);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Nenhuma sala encontrada com esse nome',
        });
      }
    },
    [addToast, roomsSearch],
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
              name="nameSearch"
              list="rooms"
              placeholder="Pesquise pelo nome da sala ou departamento..."
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />

            <datalist id="rooms">
              {rooms.map((room) => (
                <option key={room.id} value={room.name}>
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

      {roomsSearch.length !== 0 && (
        <>
          <TitleContainer>
            <div className="title">
              <h1>Salas Encontradas</h1>
            </div>
          </TitleContainer>
          {roomsSearch.map((room) => (
            <RoomsContainer key={room.id}>
              <div>
                <strong className="nameRoom">{room.name}</strong>
                <div>
                  <p>
                    <strong>ID:</strong> {room.id}
                  </p>
                  <p>
                    <strong>Criado em:</strong> {room.created_at}
                  </p>
                  <p>
                    <strong>Atualizado em:</strong> {room.updated_at}
                  </p>
                  <div className="buttonContainer">
                    <Link to={`/dashboard/room/update/${room.id}`}>
                      <button className="editorButton" type="button">
                        Editar
                      </button>
                    </Link>
                    <Link to={`/dashboard/room/equipments/${room.id}`}>
                      <button className="editorButton" type="button">
                        Ver Equipamentos
                      </button>
                    </Link>
                  </div>
                </div>

                <button
                  id="remove"
                  type="button"
                  onClick={() => removeRoom(room.id)}
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
