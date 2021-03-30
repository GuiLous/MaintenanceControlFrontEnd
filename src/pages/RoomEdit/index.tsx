/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/button';

import { FormContainer, BackButton } from './styles';

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

interface IParams {
  id: string;
}

const Room: React.FC = () => {
  const [newRoom, setNewRoom] = useState('');
  const [room, setRoom] = useState<Room | null>(null);

  const { id } = useParams<IParams>();

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  const history = useHistory();
  useEffect(() => {
    api
      .get(`/rooms/room/${id}`, {
        headers: { Authorization: AuthStr },
      })
      .then((response) => {
        setNewRoom(response.data.name);
        setRoom(response.data);
      });
  }, []);

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

        const response = await api.put<Room>(`/rooms/update/${id}`, data, {
          headers: { Authorization: AuthStr },
        });

        const findRoom = response.data;

        addToast({
          type: 'success',
          title: 'Sala atualizada com sucesso!',
        });

        setRoom(findRoom);
        setNewRoom('');
        history.push('/dashboard/rooms');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização da sala',
          description:
            'Ocorreu um erro ao tentar atualizar os dados sala, tente novamente.',
        });
      }
    },
    [addToast, room],
  );

  return (
    <>
      <Header />
      <BackButton>
        <Link to="/dashboard/rooms">
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Atualizar Sala</h1>

          <strong className="nameRoom">Nome</strong>
          <Input
            name="name"
            placeholder="Nome da sala"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
          />

          <Button type="submit">Atualizar</Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default Room;
