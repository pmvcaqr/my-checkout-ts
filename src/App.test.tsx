import { render, screen } from '@testing-library/react';
import App from './App';

test('renders checkout screen', () => {
  render(<App />);
  const element = screen.getByText(/Checkout Service/i);
  expect(element).toBeInTheDocument();
});
