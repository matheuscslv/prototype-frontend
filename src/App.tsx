import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";

import AppProvider from './hooks';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Home />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
