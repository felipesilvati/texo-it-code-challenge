import { createTestQueryClient } from "./testHelpers";

describe('createTestQueryClient', () => {
  it('creates a query client with the correct options', () => {
    const queryClient = createTestQueryClient();

    expect(queryClient.getDefaultOptions()).toEqual({
      queries: {
        retry: false,
      },
    });
  });
})