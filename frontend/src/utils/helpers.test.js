import { constructQueryString } from '@/utils/helpers';
import { onError } from '@/utils/helpers';
import { message } from 'antd';

jest.mock('antd', () => ({
  message: {
    error: jest.fn(),
  },
}));

describe('constructQueryString', () => {
  it('returns an empty string for empty parameters', () => {
    const params = {};
    const expectedQueryString = '';
    expect(constructQueryString(params)).toEqual(expectedQueryString);
  })
  it('constructs a query string from object parameters', () => {
    const params = {
      page: 1,
      size: 10,
      year: 2020,
    };
    const expectedQueryString = '?page=1&size=10&year=2020';
    expect(constructQueryString(params)).toEqual(expectedQueryString);
  });

  it('omits null and undefined parameters', () => {
    const params = {
      page: 1,
      size: null,
      year: undefined,
      winner: true,
    };
    const expectedQueryString = '?page=1&winner=true';
    expect(constructQueryString(params)).toEqual(expectedQueryString);
  });
});

describe('onError', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.resetAllMocks();
  });

  it('displays an error message', () => {
    const error = new Error('Test Error');
    onError(error);
    expect(message.error).toHaveBeenCalledWith('Failed to load data');
  });

  it('logs the error in non-test environments', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new Error('Test Error');
    onError(error);
    expect(consoleSpy).toHaveBeenCalledWith(error);

    // Clean up environment changes
    process.env.NODE_ENV = originalEnv;
  });

  it('does not log the error in test environment', () => {
    const error = new Error('Test Error');
    onError(error);
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
