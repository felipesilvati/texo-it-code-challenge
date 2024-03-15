import { render, screen, fireEvent } from '@testing-library/react';
import WinnerFilterDropdown from './WinnerFilterDropdown';

const mockSetFilters = jest.fn();
const mockSetPage = jest.fn();
const mockClose = jest.fn();

function renderWinnerFilterDropdown() {
  render(<WinnerFilterDropdown setFilters={mockSetFilters} setPage={mockSetPage} close={mockClose} />);
}

describe('WinnerFilterDropdown', () => {
  beforeEach(() => {
    mockSetFilters.mockClear();
    mockSetPage.mockClear();
    mockClose.mockClear();
  });

  it('updates checked state and calls setFilters and setPage on radio selection', () => {
    renderWinnerFilterDropdown();
    const yesRadio = screen.getByLabelText('Yes');
    const noRadio = screen.getByLabelText('No');

    // Select "Yes"
    fireEvent.click(yesRadio);
    expect(mockSetPage).toHaveBeenCalledWith(0);
    expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    expect(mockClose).toHaveBeenCalledTimes(1);

    mockSetPage.mockClear();
    mockSetFilters.mockClear();
    mockClose.mockClear();

    // Select "No"
    fireEvent.click(noRadio);
    expect(mockSetPage).toHaveBeenCalledWith(0);
    expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('resets filters and checked state on reset button click', () => {
    renderWinnerFilterDropdown();
    const resetButton = screen.getByTestId('reset-button');

    fireEvent.click(resetButton);
    expect(mockSetPage).toHaveBeenCalledWith(0);
    expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('calls close on close button click', () => {
    renderWinnerFilterDropdown();
    const closeButton = screen.getByTestId('close-button');

    fireEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});