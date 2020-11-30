import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './Styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storedRepositories = localStorage.getItem('@githubExplorer: repositories');

    if (storedRepositories) {
      return JSON.parse(storedRepositories);
    }

    return [];
  });
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem('@githubExplorer: repositories', JSON.stringify(repositories));
  }, [repositories])

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if(!newRepo) {
      setInputError('digite  autor/nome do repositorio.');
      return;
    }
    
    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);
    
      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch(error) {
      setInputError('Erro na busca por esse repositorio.');
    }
  }

  return (
    <>
      <img src={logoImg} alt="github explorer" />
      <Title>Explore Repositorios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository} >
        <input
        value={newRepo}
        onChange={e => setNewRepo(e.target.value)}
        placeholder="Digite o nome do repositorio"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      { inputError && <Error>{inputError}</Error> }

      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
          <img
           src={repository.owner.avatar_url} 
           alt={repository.owner.login}
          />
          <div>
            <strong>{repository.full_name}</strong>
            <p> {repository.description} </p>
          </div>

          <FiChevronRight size={20} />
        </Link>
        ))}
      </Repositories>

    </>
  );
};

export default Dashboard;