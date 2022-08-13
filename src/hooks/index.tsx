import React from 'react';

import { AuthProvider } from './auth';
import { UnitProvider } from './unit';
import { FunctionProvider } from './function';

interface IProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<IProps> = ({ children }) => (
  <AuthProvider>
    <UnitProvider>
      <FunctionProvider>
        {children}
      </FunctionProvider>
    </UnitProvider>
  </AuthProvider>
);

export default AppProvider;
