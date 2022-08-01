import React, {
  createContext, useCallback, useState, useContext, useMemo,
} from 'react';

import api from '../services/api';

interface User {
  id: number;
  name: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials{
  cpf: string;
  password: string;
}

interface AuthContextData {
  user: User;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  signIn(credentias: SignInCredentials): Promise<void>;
  signOut(): void;
  signed: boolean;
}

interface IProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<IProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@project:token');
    const user = localStorage.getItem('@project:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signed = useMemo(
    () => !!data.token && !!data.user,
    [data],
  );

  const signIn = useCallback(async ({ cpf, password }: SignInCredentials) => {
    try {
      setLoading(true);

      const response = await api.post(`login`, {
        cpf,
        password,
      });

      const { auth, user } = response.data;

      localStorage.setItem('@project:token', auth.token);
      localStorage.setItem('@project:user', JSON.stringify(user));

      // @ts-ignore
      api.defaults.headers.authorization = `Bearer ${auth.token}`;

      setData({ token: auth.token, user });

      window.location.href = '/home';
    } catch (error) {
      setLoading(false);

      localStorage.removeItem('@project:token');
      localStorage.removeItem('@project:user');
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@project:token');
    localStorage.removeItem('@project:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{
      user: data.user, loading, signed, signIn, signOut,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an authProvider');
  }

  return context;
}
