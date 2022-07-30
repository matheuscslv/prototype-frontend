import '@testing-library/jest-dom';
import React from "react";

import { render, screen } from '@testing-library/react';

import Home from '../pages/Home';

describe("Home", () => {
  test("Deve exibir um página de Home com o texto: 'Home'", async () => {
    render(<Home />);

    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
