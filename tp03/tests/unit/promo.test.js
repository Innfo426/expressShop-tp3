const { applyPromoCode } = require('../../src/pricing/promo');

describe('applyPromoCode', () => {
  test('renvoie le prix inchangé sans code ou avec un code inconnu', () => {
    expect(applyPromoCode(100)).toBe(100);
    expect(applyPromoCode(100, 'INCONNU')).toBe(100);
  });

  test('retire 10 % avec le code SAVE10', () => {
    expect(applyPromoCode(100, 'SAVE10')).toBe(90);
  });
});
