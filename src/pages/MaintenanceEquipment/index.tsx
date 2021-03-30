/* eslint-disable import/no-duplicates */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import Header from '../../components/Header';

import { RoomsContainer, TitleContainer, BackButton } from './styles';

interface Equipment {
  id: string;
  name: string;
  tombo: string;
  room_id: string;
  created_at: Date;
  updated_at: Date;
}

interface IParams {
  id: string;
}

const Maintenance: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment | null>(null);

  const { id } = useParams<IParams>();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  useEffect(() => {
    api
      .get(`/equipments/equipment/${id}`, {
        headers: { Authorization: AuthStr },
      })
      .then((response) => {
        setEquipment(response.data);
      });
  }, []);

  return (
    <>
      <Header />
      <TitleContainer>
        <div className="title">
          <h1>Equipamento Da Manutenção</h1>
        </div>
      </TitleContainer>
      <BackButton>
        <Link to="/dashboard/maintenances">
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      {!equipment && (
        <RoomsContainer>
          <div>
            <strong className="nameRoom">
              Obs: Equipamento não encontrado!
            </strong>
            <p id="empity">Verifique se o equipamento ainda existe.</p>
          </div>
        </RoomsContainer>
      )}
      <RoomsContainer>
        <div>
          <strong className="nameRoom">Nome: {equipment?.name}</strong>
          <div>
            <p>
              <strong>ID:</strong> {equipment?.id}
            </p>
            <p>
              <strong>Tombo:</strong> {equipment?.tombo}
            </p>
            <p>
              <strong>Room_Id:</strong> {equipment?.room_id}
            </p>
            <p>
              <strong>Criade em:</strong> {equipment?.created_at}
            </p>
            <p>
              <strong>Atualizado em:</strong> {equipment?.updated_at}
            </p>
          </div>
        </div>
      </RoomsContainer>
    </>
  );
};

export default Maintenance;
