const invokeMock = jest.fn();

const supabaseMock = {
  functions: {
    invoke: invokeMock,
  },
  // Add other mocked methods if needed by services
  from: () => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  }),
};

module.exports = {
  createClient: jest.fn(() => supabaseMock),
  // Export the mock function so tests can configure it
  invokeMock,
}; 