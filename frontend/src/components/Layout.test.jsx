

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
useRouter.mockImplementation(() => ({
  push: mockPush,
  pathname: '/',
}));

describe('Layout', () => {
  it('renders the dashboard on initial render', async () => {
    render(<Layout />);
    await waitFor(() => expect(screen.getByText('Dashboard')).toBeInTheDocument());
  });

  it('renders the movies page when the movies link is clicked', async () => {
    render(<Layout />);
    fireEvent.click(screen.getByText('Movies'));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/movies'));
  });

  it('highlights the correct menu item based on the current route', async () => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
      pathname: '/movies',
    }));

    render(<Layout />);
    await waitFor(() => {
      const moviesMenuItem = screen.getByText('Movies').closest('li');
      expect(moviesMenuItem).toHaveClass('ant-menu-item-selected'); // Adjust based on your actual implementation
    });
  });

  it('renders children content correctly', async () => {
    const childrenContent = "Children Content";
    render(<Layout>{childrenContent}</Layout>);
    await waitFor(() => expect(screen.getByText(childrenContent)).toBeInTheDocument());
  });
});
