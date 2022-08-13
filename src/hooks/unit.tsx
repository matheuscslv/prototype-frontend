import React, {
  createContext, useCallback, useState, useContext,
} from 'react';

interface IUnit {
  id: number;
  sigla: string;
  nome: string;
  funcao?: string;
}

interface UnitContextData {
  units: IUnit[];
  addUnit(unit: IUnit): void;
  updateUnit(unit: IUnit): void;
  deleteUnit(id: number): void;
}

interface IProps {
  children: React.ReactNode;
}

const UnitContext = createContext<UnitContextData>({} as UnitContextData);

export const UnitProvider: React.FC<IProps> = ({ children }) => {
  const [units, setUnits] = useState<IUnit[]>([]);

  const addUnit = useCallback((unit: IUnit) => {
    setUnits([...units, unit]);
  }, [units]);

  const updateUnit = useCallback((unit: IUnit) => {
    setUnits(units.map((item) => (item.id === unit.id ? unit : item)));
  }, [units]);

  const deleteUnit = useCallback((id: number) => {
    setUnits(units.filter((item) => item.id !== id));
  }, [units]);

  return (
    <UnitContext.Provider value={{
      units, addUnit, updateUnit, deleteUnit,
    }}
    >
      {children}
    </UnitContext.Provider>
  );
};

export function useUnit(): UnitContextData {
  const context = useContext(UnitContext);

  if (!context) {
    throw new Error('useUnit must be used within an unitProvider');
  }

  return context;
}
