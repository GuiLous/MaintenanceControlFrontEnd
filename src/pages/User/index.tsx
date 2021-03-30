/* eslint-disable camelcase */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { FiArrowLeft, FiXCircle } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/button';

import { RoomsContainer, FormContainer, BackButton } from './styles';

import getValidationErrors from '../../utils/getValidationErrors';

interface User {
  id: string;
  name: string;
  email: string;
  // password: string;
  created_at: Date;
  updated_at: Date;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const User: React.FC = () => {
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [users, setUsers] = useState<User[]>([]);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  // const [issues, setIssues] = useState<Issue[]>([]);
  useEffect(() => {
    api
      .get('/users', { headers: { Authorization: AuthStr } })
      .then((response) => {
        setUsers(response.data);
      });
  }, []);

  const removeUser = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/users/delete/${id}`, {
          headers: { Authorization: AuthStr },
        });

        const findUser = users.findIndex((user) => user.id === id);

        const listUsers = [...users];

        listUsers.splice(findUser, 1);

        setUsers(listUsers);

        addToast({
          type: 'success',
          title: 'Usuário Excluido!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro ao exlcuir usuário',
          description:
            'Ocorreu um erro ao tentar excluir o usuário, tente novamente.',
        });
      }
    },
    [addToast, users],
  );

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
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

        const response = await api.post<User>('/users', data, {
          headers: { Authorization: AuthStr },
        });

        const user = response.data;

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Email já pode ser usado para logon.',
        });

        setUsers([...users, user]);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro , tente novamente.',
        });
      }
    },
    [addToast, users],
  );

  return (
    <>
      <Header />
      <BackButton>
        <Link to="/dashboard">
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      <FormContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Cadastrar Usuário</h1>

          <strong className="nameRoom">Nome</strong>
          <Input
            name="name"
            placeholder="Nome do usuário..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <strong className="nameRoom">Email</strong>
          <Input
            name="email"
            placeholder="Email do usuário..."
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <strong className="nameRoom">Password</strong>
          <Input
            name="password"
            placeholder="Digite uma senha segura..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit">Criar</Button>
        </Form>
      </FormContainer>

      {users.length === 0 && (
        <RoomsContainer>
          <div>
            <strong className="nameRoom">Opps!</strong>
            <p id="empity">Nenhum usuário foi encontrado.</p>
          </div>
        </RoomsContainer>
      )}

      {users.map((user) => (
        <RoomsContainer key={user.id}>
          <div>
            <strong className="nameRoom">{user.name}</strong>
            <div>
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {/* <p>
                <strong>Password:</strong> {user.password}
              </p> */}
              <p>
                <strong>Criado em:</strong> {user.created_at}
              </p>
              <p>
                <strong>Atualizado em:</strong> {user.updated_at}
              </p>
              <div className="buttonContainer">
                <Link to={`/dashboard/user/update/${user.id}`}>
                  <button className="editorButton" type="button">
                    Editar
                  </button>
                </Link>
              </div>
            </div>

            <button
              id="remove"
              type="button"
              onClick={() => removeUser(user.id)}
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

export default User;
