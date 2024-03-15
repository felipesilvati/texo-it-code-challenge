import { render, screen, fireEvent } from '@testing-library/react';
import YearFilterDropdown from './YearFilterDropdown';

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  // Mock only the message component
  const message = {
    ...antd.message,
    error: jest.fn(),
  };

  return {
    ...antd,
    message,
  };
});

const mockHandleSearch = jest.fn();
const mockHandleReset = jest.fn();
const mockClose = jest.fn();

function renderYearFilterDropdown() {
  return render(
    <YearFilterDropdown
      dataIndex="year"
      handleSearch={mockHandleSearch}
      handleReset={mockHandleReset}
      close={mockClose}
    />
  );
}

describe('YearFilterDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('searches with valid year input', () => {
    renderYearFilterDropdown();
    const input = screen.getByTestId('year-input');
    const searchButton = screen.getByTestId('search-button');

    fireEvent.change(input, { target: { value: '1989' } });
    fireEvent.click(searchButton);

    expect(mockHandleSearch).toHaveBeenCalledWith('1989', 'year');
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('shows error message for invalid year input', () => {
    const { message } = require('antd');
    renderYearFilterDropdown();
    const input = screen.getByTestId('year-input');
    const searchButton = screen.getByTestId('search-button');

    fireEvent.change(input, { target: { value: 'notAYear' } });
    fireEvent.click(searchButton);

    expect(message.error).toHaveBeenCalledWith('Please enter a valid year');
    expect(mockHandleSearch).not.toHaveBeenCalled();
    expect(mockClose).not.toHaveBeenCalled();
  });

  it('resets input and calls handleReset on reset button click', () => {
    renderYearFilterDropdown();
    const input = screen.getByTestId('year-input');
    const resetButton = screen.getByTestId('reset-button');

    // Change and then reset input
    fireEvent.change(input, { target: { value: '1989' } });
    fireEvent.click(resetButton);

    expect(input.value).toBe('');
    expect(mockHandleReset).toHaveBeenCalledTimes(1);
  });

  it('calls close on close button click', () => {
    renderYearFilterDropdown();
    const closeButton = screen.getByTestId('close-button');

    fireEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

})