import React, {
  createContext, useCallback, useState, useContext,
} from 'react';

interface IFunction {
  id: number;
  nome: string;
  unidades: string[];
}

interface FunctionContextData {
  functions: IFunction[];
  addFunction(func: IFunction): void;
  updateFunction(func: IFunction): void;
  deleteFunction(id: number): void;
}

interface IProps {
  children: React.ReactNode;
}

const UnitContext = createContext<FunctionContextData>({} as FunctionContextData);

export const FunctionProvider: React.FC<IProps> = ({ children }) => {
  const [functions, setFunctions] = useState<IFunction[]>([]);

  const addFunction = useCallback((func: IFunction) => {
    setFunctions([...functions, func]);
  }, [functions]);

  const updateFunction = useCallback((func: IFunction) => {
    setFunctions(functions.map((item) => (item.id === func.id ? func : item)));
  }, [functions]);

  const deleteFunction = useCallback((id: number) => {
    setFunctions(functions.filter((item) => item.id !== id));
  }, [functions]);

  return (
    <UnitContext.Provider value={{
      functions, addFunction, updateFunction, deleteFunction,
    }}
    >
      {children}
    </UnitContext.Provider>
  );
};

export function useFunction(): FunctionContextData {
  const context = useContext(UnitContext);

  if (!context) {
    throw new Error('useFunction must be used within an functionProvider');
  }

  return context;
}
