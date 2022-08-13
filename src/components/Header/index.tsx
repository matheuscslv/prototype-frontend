import React, { PropsWithChildren } from 'react';

import { useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';

const Header: React.FC<PropsWithChildren> = () => {
  const { signOut } = useAuth();

  const history = useHistory();

  return (
    <>
      <button onClick={() => history.push('unidade')}>Unidades</button>
      <button onClick={() => history.push('funcao')}>Função</button>
      <button onClick={signOut}>Sair</button>
    </>
  );
};

export default Header;
