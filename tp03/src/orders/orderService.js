function createOrderService({ paymentGateway, orderRepository, mailer }) {
  async function placeOrder({ customerEmail, items }) {
    if (items.length === 0) {
      throw new Error('Commande vide');
    }

    const rawTotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const total = Math.round(rawTotal * 100) / 100;

    // 1. On vérifie d'abord le paiement AVANT d'enregistrer la commande
    const payment = await paymentGateway.charge({ amount: total, email: customerEmail });
    if (!payment.ok) {
      throw new Error('Paiement refusé');
    }

    // 2. Ensuite on enregistre la commande
    const order = await orderRepository.save({
      customerEmail,
      items,
      total,
      status: 'confirmed',
    });

    // 3. On protège l'envoi de l'e-mail pour qu'une panne ne bloque pas la commande
    try {
      await mailer.send(customerEmail, `Commande ${order.id} confirmée`);
    } catch (error) {
      // L'échec de l'e-mail est ignoré selon la spécification
    }

    return order;
  }

  return { placeOrder };
}

module.exports = { createOrderService };
