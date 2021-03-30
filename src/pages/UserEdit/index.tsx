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

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
}

interface IParams {
  id: string;
}

const User: React.FC = () => {
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [user, setUser] = useState<User | null>(null);

  const { id } = useParams<IParams>();

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  const history = useHistory();
  useEffect(() => {
    api
      .get(`/users/user/${id}`, {
        headers: { Authorization: AuthStr },
      })
      .then((response) => {
        setNewName(response.data.name);
        setNewEmail(response.data.email);
        setNewPassword(response.data.password);
        setUser(response.data);
      });
  }, []);

  const handleSubmit = useCallback(
    async (data: UserFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.put<User>(`/users/update/${id}`, data, {
          headers: { Authorization: AuthStr },
        });

        const findUser = response.data;

        addToast({
          type: 'success',
          title: 'Atualizado com realizado!',
        });

        setUser(findUser);
        setNewName('');
        setNewEmail('');
        setNewPassword('');

        history.push('/dashboard/users');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao atualizar',
          description: 'Ocorreu um erro ao tentar atualizar, tente novamente.',
        });
      }
    },
    [addToast, user],
  );

  return (
    <>
      <Header />
      <BackButton>
        <Link to="/dashboard/users">
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Editar Usuário</h1>

          <strong className="nameRoom">Nome</strong>
          <Input
            name="name"
            placeholder="Nome do usuário"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <strong className="nameRoom">Email</strong>
          <Input
            name="email"
            placeholder="Email do usuário"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <strong className="nameRoom">Password</strong>
          <Input
            name="password"
            placeholder="Digite uma senha segura."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button type="submit">Atualizar</Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default User;
