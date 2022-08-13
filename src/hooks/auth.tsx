import React, {
  createContext, useCallback, useState, useContext, useMemo,
} from 'react';

interface IUser {
  id: number;
  name: string;
  cpf: string;
  password: string;
}

interface AuthState {
  token: string;
  user: IUser;
}

interface SignInCredentials{
  cpf: string;
  password: string;
}

interface AuthContextData {
  user: IUser;
  loading: boolean;
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

      const token = Date.now().toString();

      const user = {
        id: Date.now(),
        name: new Date().toISOString(),
        cpf,
        password,
      };

      localStorage.setItem('@project:token', token);
      localStorage.setItem('@project:user', JSON.stringify(user));

      setData({
        token: Date.now().toString(),
        user,
      });

      window.location.href = '/unidade';
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
