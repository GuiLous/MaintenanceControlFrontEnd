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

import { RoomsContainer, FormContainer, BackButton } from './styles';

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

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  const history = useHistory();
  useEffect(() => {
    api
      .get(`/equipments/equipment/${id}`, {
        headers: { Authorization: AuthStr },
      })
      .then((response) => {
        setNewName(response.data.name);
        setNewTombo(response.data.tombo);
        setEquipment(response.data);
      });
    api
      .get('/rooms', { headers: { Authorization: AuthStr } })
      .then((response) => {
        setRooms(response.data);
      });
  }, []);

  const handleSubmit = useCallback(
    async (data: EquipmentFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          tombo: Yup.string().required('Tombo obrigatório'),
          room_id: Yup.string().required('Sala obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.put<Equipment>(
          `/equipments/update/${id}`,
          data,
          {
            headers: { Authorization: AuthStr },
          },
        );

        const findEquipment = response.data;

        addToast({
          type: 'success',
          title: 'Equipamento atualizado com sucesso!',
        });

        setEquipment(findEquipment);
        setNewName('');
        setNewTombo('');
        setRoomId('');

        history.push('/dashboard/equipments');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização do equipamento',
          description:
            'Ocorreu um erro ao tentar atualizar o equipamento, tente novamente.',
        });
      }
    },
    [addToast, equipment],
  );

  return (
    <>
      <Header />
      <BackButton>
        <Link to="/dashboard/equipments">
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Atualizar Equipamento</h1>

          <strong className="nameRoom">Nome</strong>
          <Input
            name="name"
            placeholder="Nome do equipamento"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <strong className="nameRoom">Tombo</strong>
          <Input
            name="tombo"
            placeholder="Tombo do equipamento"
            value={newTombo}
            onChange={(e) => setNewTombo(e.target.value)}
          />

          <strong className="nameRoom">Sala ID</strong>
          <Input
            name="room_id"
            list="rooms"
            placeholder="Sala em que se encontra"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <datalist id="rooms">
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </datalist>

          <Button type="submit">Atualizar</Button>
        </Form>
      </FormContainer>

      {rooms.length === 0 && (
        <RoomsContainer>
          <div>
            <strong className="nameRoom">
              Obs: Você não tem nenhuma sala criada!
            </strong>
            <p id="empity">Para atualizar é necessário uma sala.</p>
          </div>
        </RoomsContainer>
      )}
    </>
  );
};

export default Room;
