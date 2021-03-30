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

interface Equipment {
  id: string;
  name: string;
  roomName: string;
  tombo: string;
  room_id: string;
  created_at: Date;
  updated_at: Date;
}

interface Room {
  id: string;
  name: string;
}

interface IParams {
  id: string;
}

interface EquipmentFormData {
  name: string;
  tombo: string;
  room_id: string;
}

const Room: React.FC = () => {
  const [newName, setNewName] = useState('');
  const [newTombo, setNewTombo] = useState('');
  const [roomId, setRoomId] = useState('');

  const { id } = useParams<IParams>();

  const [room, setRoom] = useState<Room | null>(null);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  const history = useHistory();
  useEffect(() => {
    api
      .get(`/rooms/room/${id}`, { headers: { Authorization: AuthStr } })
      .then((response) => {
        setRoom(response.data);
      });
  }, []);

  const handleSubmit = useCallback(
    async (data: EquipmentFormData) => {
      try {
        formRef.current?.setErrors({});
        // eslint-disable-next-line no-param-reassign
        data.room_id = id;

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          tombo: Yup.string().required('Tombo obrigatório'),
          room_id: Yup.string().required('Sala obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post<Equipment>('/equipments', data, {
          headers: { Authorization: AuthStr },
        });

        // const equipment = response.data;

        addToast({
          type: 'success',
          title: 'Equipamento criado!',
        });

        // setEquipments([...equipments, equipment]);
        setNewName('');
        setNewTombo('');
        setRoomId('');
        history.push(`/dashboard/room/equipments/${id}`);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na criação do equipamento',
          description:
            'Ocorreu um erro ao tentar criar o equipamento, tente novamente.',
        });
      }
    },
    [addToast],
  );

  return (
    <>
      <Header />
      <BackButton>
        <Link to={`/dashboard/room/equipments/${room?.id}`}>
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Vincular Equipamento a {room?.name}</h1>

          <strong className="nameRoom">Nome</strong>
          <Input
            name="name"
            placeholder="Nome do equipamento..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <strong className="nameRoom">Tombo</strong>
          <Input
            name="tombo"
            placeholder="Tombo do equipamento..."
            value={newTombo}
            onChange={(e) => setNewTombo(e.target.value)}
          />

          <Button type="submit">Criar</Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default Room;
