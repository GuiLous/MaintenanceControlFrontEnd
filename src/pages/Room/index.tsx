/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { FiXCircle, FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
// import logoImg from '../../assets/logo.svg';
import { useToast } from '../../hooks/toast';

import HeaderRoom from '../../components/HeaderRoom';
import Input from '../../components/Input';
import Button from '../../components/button';

import { RoomsContainer, FormContainer, BackButton } from './styles';

import getValidationErrors from '../../utils/getValidationErrors';

interface Room {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface RoomFormData {
  name: string;
}

interface RoomFormDataSearch {
  nameSearch: string;
}

const Room: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  // const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    api
      .get('/rooms', { headers: { Authorization: AuthStr } })
      .then((response) => {
        setRooms(response.data);
      });
  }, []);

  const removeRoom = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/rooms/delete/${id}`, {
          headers: { Authorization: AuthStr },
        });

        const findRoom = rooms.findIndex((room) => room.id === id);

        const listRooms = [...rooms];

        listRooms.splice(findRoom, 1);

        setRooms(listRooms);

        addToast({
          type: 'success',
          title: 'Sala Excluida!',
        });
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
    [addToast, rooms],
  );

  const handleSubmit = useCallback(
    async (data: RoomFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post<Room>('/rooms', data, {
          headers: { Authorization: AuthStr },
        });

        const room = response.data;

        addToast({
          type: 'success',
          title: 'Sala criada!',
        });

        setRooms([...rooms, room]);
        setNewRepo('');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na criação de sala',
          description: 'Ocorreu um erro ao tentar criar sala, tente novamente.',
        });
      }
    },
    [addToast, rooms],
  );

  return (
    <>
      <HeaderRoom />
      <BackButton>
        <Link to="/dashboard">
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Criar Sala/Departamento</h1>

          <strong className="nameRoom">Nome</strong>
          <Input
            name="name"
            placeholder="Digite o nome da sala ou departamento..."
            value={newRepo}
            onChange={(e) => setNewRepo(e.target.value)}
          />

          <Button type="submit">Criar</Button>
        </Form>
      </FormContainer>

      {rooms.length === 0 && (
        <RoomsContainer>
          <div>
            <strong className="nameRoom">Opps!</strong>
            <p id="empity">Nenhuma sala/departamento foi encontrada(o).</p>
          </div>
        </RoomsContainer>
      )}

      {rooms.map((room) => (
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
  );
};

export default Room;
