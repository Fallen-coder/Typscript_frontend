// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders the navigation brand correctly', () => {
    render(<App />);
    const brandElement = screen.getByText(/API Testēšana/i);
    expect(brandElement).toBeDefined();
  });

  it('renders the initial posts tab content', () => {
    render(<App />);
    // Izmantojam getAllByText un paņemam pirmo elementu, lai izvairītos no dubultēšanās konflikta
    const headings = screen.getAllByText(/Raksti/i);
    expect(headings.length).toBeGreaterThan(0);
  });
});