export const stripe = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({
      id: 'pi_test_123',
    }),
  },
};
