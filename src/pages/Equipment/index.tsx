/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { FiArrowLeft, FiXCircle } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import HeaderEquipment from '../../components/HeaderEquipment';
import Input from '../../components/Input';
import Button from '../../components/button';

import { RoomsContainer, FormContainer, BackButton } from './styles';

import getValidationErrors from '../../utils/getValidationErrors';

interface Equipment {
  id: string;
  name: string;
  tombo: string;
  room_id: string;
  created_at: Date;
  updated_at: Date;
}

interface Room {
  id: string;
  name: string;
}

interface EquipmentFormData {
  name: string;
  tombo: string;
  room_id: string;
}

const Equipment: React.FC = () => {
  const [newName, setNewName] = useState('');
  const [newTombo, setNewTombo] = useState('');
  const [roomId, setRoomId] = useState('');

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  // const [issues, setIssues] = useState<Issue[]>([]);
  useEffect(() => {
    api
      .get('/equipments', { headers: { Authorization: AuthStr } })
      .then((response) => {
        setEquipments(response.data);
      });
    api
      .get('/rooms', { headers: { Authorization: AuthStr } })
      .then((response) => {
        setRooms(response.data);
      });
  }, [roomId]);

  const removeEquipment = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/equipments/delete/${id}`, {
          headers: { Authorization: AuthStr },
        });

        const findEquipment = equipments.findIndex(
          (equipment) => equipment.id === id,
        );

        const listEquipments = [...equipments];

        listEquipments.splice(findEquipment, 1);

        setEquipments(listEquipments);

        addToast({
          type: 'success',
          title: 'Equipamento Excluido!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao exlcuir equipamento',
          description:
            'Ocorreu um erro ao tentar excluir o equipamento, tente novamente.',
        });
      }
    },
    [addToast, equipments],
  );

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

        const response = await api.post<Equipment>('/equipments', data, {
          headers: { Authorization: AuthStr },
        });

        const equipment = response.data;

        // history.push('/');
        addToast({
          type: 'success',
          title: 'Equipamento criado!',
        });

        setEquipments([...equipments, equipment]);
        setNewName('');
        setNewTombo('');
        setRoomId('');
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
    [addToast, equipments],
  );

  return (
    <>
      <HeaderEquipment />
      <BackButton>
        <Link to="/dashboard">
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Criar Equipamento</h1>

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

          <strong className="nameRoom">Sala ID</strong>
          <Input
            name="room_id"
            list="rooms"
            placeholder="Sala em que se encontra..."
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

          <Button type="submit">Criar</Button>
        </Form>
      </FormContainer>

      {equipments.length === 0 && (
        <RoomsContainer>
          <div>
            <strong className="nameRoom">Opps!</strong>
            <p id="empity">Nenhum equipamento foi encontrado.</p>
          </div>
        </RoomsContainer>
      )}

      {rooms.length === 0 && (
        <RoomsContainer>
          <div>
            <strong className="nameRoom">
              Obs: Você não tem nenhuma sala criada!
            </strong>
            <p id="empity">
              Para adicionar novos equipamentos é necessário uma sala.
            </p>
          </div>
        </RoomsContainer>
      )}

      {equipments.map((equipment) => (
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
                <Link to={`/dashboard/equipment/maintenances/${equipment.id}`}>
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
  );
};

export default Equipment;
