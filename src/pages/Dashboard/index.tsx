/* eslint-disable camelcase */
import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import iconRoomImg from '../../assets/meeting-room.svg';
import iconEquipmentImg from '../../assets/equipment.svg';
import iconMaintenanceImg from '../../assets/maintenance.svg';
import iconUserImg from '../../assets/manage_accounts-black-18dp.svg';

import Header from '../../components/Header';

import { Container } from './styles';

const Dashboard: React.FC = () => {
  return (
    <>
      <Header />

      <Container>
        <Link to="/dashboard/rooms">
          <img src={iconRoomImg} alt="room icon" />
          <div>
            <strong>SALAS/DEPARTAMENTOS</strong>
            <p>Entre para ver, criar, excluir ou editar</p>
          </div>

          <FiChevronRight size={20} />
        </Link>

        <Link to="/dashboard/equipments">
          <img src={iconEquipmentImg} alt="equipments icon" />
          <div>
            <strong>EQUIPAMENTOS</strong>
            <p>Entre para ver, criar, excluir ou editar</p>
          </div>

          <FiChevronRight size={20} />
        </Link>

        <Link to="/dashboard/maintenances">
          <img src={iconMaintenanceImg} alt="equipments icon" />
          <div>
            <strong>MANUTENÇÕES</strong>
            <p>Entre para ver, criar, excluir ou editar</p>
          </div>

          <FiChevronRight size={20} />
        </Link>

        <Link to="/dashboard/users">
          <img src={iconUserImg} alt="users icon" />
          <div>
            <strong>USUÁRIOS</strong>
            <p>Entre para ver, criar, excluir ou editar</p>
          </div>

          <FiChevronRight size={20} />
        </Link>
      </Container>
    </>
  );
};

export default Dashboard;
