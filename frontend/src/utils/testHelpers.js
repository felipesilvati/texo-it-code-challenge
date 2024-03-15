import { QueryClient } from '@tanstack/react-query';

export const createTestQueryClient = () => new QueryClient({
  logger: {
    log: () => { },
    warn: () => { },
    error: () => { }
  },
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});