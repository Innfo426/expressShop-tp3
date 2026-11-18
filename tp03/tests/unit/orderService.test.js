const { createOrderService } = require('../../src/orders/orderService');

describe('orderService', () => {
  const sampleItems = [{ productId: 'p1', quantity: 2, unitPrice: 15.5 }];
  const customerEmail = 'client@expressshop.fr';

  test('Paiement accepté : la commande est enregistrée avec le statut confirmed', async () => {
    const paymentGateway = { charge: jest.fn().mockResolvedValue({ ok: true }) };
    const orderRepository = {
      save: jest.fn().mockImplementation(async (order) => ({ id: 42, ...order })),
    };
    const mailer = { send: jest.fn().mockResolvedValue() };

    const service = createOrderService({ paymentGateway, orderRepository, mailer });
    const result = await service.placeOrder({ customerEmail, items: sampleItems });

    expect(orderRepository.save).toHaveBeenCalledWith({
      customerEmail,
      items: sampleItems,
      total: 31,
      status: 'confirmed',
    });
    expect(result).toEqual({
      id: 42,
      customerEmail,
      items: sampleItems,
      total: 31,
      status: 'confirmed',
    });
  });

  test('Paiement refusé : la commande n est pas enregistrée et aucun e-mail n est envoyé', async () => {
    const paymentGateway = { charge: jest.fn().mockResolvedValue({ ok: false }) };
    const orderRepository = { save: jest.fn() };
    const mailer = { send: jest.fn() };

    const service = createOrderService({ paymentGateway, orderRepository, mailer });

    await expect(service.placeOrder({ customerEmail, items: sampleItems }))
      .rejects.toThrow('Paiement refusé');

    expect(orderRepository.save).not.toHaveBeenCalled();
    expect(mailer.send).not.toHaveBeenCalled();
  });

  test('Paiement accepté : l e-mail est envoyé une seule fois à l adresse du client', async () => {
    const paymentGateway = { charge: jest.fn().mockResolvedValue({ ok: true }) };
    const orderRepository = {
      save: jest.fn().mockResolvedValue({ id: 42, status: 'confirmed' }),
    };
    const mailer = { send: jest.fn().mockResolvedValue() };

    const service = createOrderService({ paymentGateway, orderRepository, mailer });
    await service.placeOrder({ customerEmail, items: sampleItems });

    expect(mailer.send).toHaveBeenCalledTimes(1);
    expect(mailer.send).toHaveBeenCalledWith(customerEmail, 'Commande 42 confirmée');
  });

  test('Service d e-mail en panne : la commande reste confirmée et aucune erreur n est levée', async () => {
    const paymentGateway = { charge: jest.fn().mockResolvedValue({ ok: true }) };
    const orderRepository = {
      save: jest.fn().mockResolvedValue({ id: 42, status: 'confirmed' }),
    };
    const mailer = { send: jest.fn().mockRejectedValue(new Error('Serveur SMTP hors service')) };

    const service = createOrderService({ paymentGateway, orderRepository, mailer });
    const result = await service.placeOrder({ customerEmail, items: sampleItems });

    expect(result.status).toBe('confirmed');
  });

  test('Commande vide : lève une erreur et n appelle aucune dépendance', async () => {
    const paymentGateway = { charge: jest.fn() };
    const orderRepository = { save: jest.fn() };
    const mailer = { send: jest.fn() };

    const service = createOrderService({ paymentGateway, orderRepository, mailer });

    await expect(service.placeOrder({ customerEmail, items: [] }))
      .rejects.toThrow('Commande vide');

    expect(paymentGateway.charge).not.toHaveBeenCalled();
    expect(orderRepository.save).not.toHaveBeenCalled();
    expect(mailer.send).not.toHaveBeenCalled();
  });
});












