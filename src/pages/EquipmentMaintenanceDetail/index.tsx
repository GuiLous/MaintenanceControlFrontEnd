/* eslint-disable import/no-duplicates */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { Link } from 'react-router-dom';
import { FiArrowLeft, FiXCircle } from 'react-icons/fi';
import api from '../../services/api';
import Header from '../../components/Header';

import { RoomsContainer, TitleContainer, BackButton } from './styles';

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

interface IParams {
  id: string;
}

const Maintenance: React.FC = () => {
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);

  const { id } = useParams<IParams>();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  useEffect(() => {
    api
      .get(`/maintenances/maintenance/${id}`, {
        headers: { Authorization: AuthStr },
      })
      .then((response) => {
        setMaintenance(response.data);
      });
  }, []);

  return (
    <>
      <Header />
      <TitleContainer>
        <div className="title">
          <h1>Detalhes da Manutenção</h1>
        </div>
      </TitleContainer>
      <BackButton>
        <Link
          to={`/dashboard/equipment/maintenances/${maintenance?.equipment_id}`}
        >
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      {!maintenance && (
        <RoomsContainer>
          <div>
            <strong className="nameRoom">
              Obs: Manutenção não encontrado!
            </strong>
            <p id="empity">Verifique se a manuteção ainda existe.</p>
          </div>
        </RoomsContainer>
      )}
      <RoomsContainer>
        <div>
          <strong className="nameRoom">{maintenance?.titleMaintenance}</strong>
          <div>
            <p>
              <strong>ID:</strong> {maintenance?.id}
            </p>
            <p>
              <strong>Descrição:</strong> {maintenance?.description}
            </p>
            <p>
              <strong>Responsável:</strong>
              {maintenance?.responsibleMaintenance}
            </p>
            <p>
              <strong>Equipamento ID:</strong> {maintenance?.equipment_id}
            </p>
            <p>
              <strong>Data da Manutenção:</strong> {maintenance?.date}
            </p>
            <p>
              <strong>Criado em:</strong> {maintenance?.created_at}
            </p>
            <p>
              <strong>Atualizado em:</strong> {maintenance?.updated_at}
            </p>
            <div className="buttonContainer">
              <Link to={`/dashboard/maintenance/update/${maintenance?.id}`}>
                <button className="editorButton" type="button">
                  Editar
                </button>
              </Link>
            </div>
          </div>

          <button
            id="remove"
            type="button"
            // onClick={() => removeMaintenance(maintenance?.id)}
          >
            excluir
            <FiXCircle size={30} />
          </button>
        </div>
      </RoomsContainer>
    </>
  );
};

export default Maintenance;
