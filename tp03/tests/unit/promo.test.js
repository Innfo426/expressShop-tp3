const { applyPromoCode } = require('../../src/pricing/promo');

describe('applyPromoCode', () => {
  test('renvoie le prix inchangé sans code ou avec un code inconnu', () => {
    expect(applyPromoCode(100)).toBe(100);
    expect(applyPromoCode(100, 'INCONNU')).toBe(100);
  });

  test('retire 10 % avec le code SAVE10', () => {
    expect(applyPromoCode(100, 'SAVE10')).toBe(90);
  });

  test('retire 20 % avec le code SAVE20', () => {
    expect(applyPromoCode(100, 'SAVE20')).toBe(80);
  });

  test('arrondit le résultat à 2 décimales', () => {
    expect(applyPromoCode(19.99, 'SAVE10')).toBe(17.99);
  });

  test('lève une RangeError si le prix est négatif ou pas un nombre', () => {
    expect(() => applyPromoCode(-10, 'SAVE10')).toThrow(RangeError);
    expect(() => applyPromoCode('100', 'SAVE10')).toThrow(RangeError);
    expect(() => applyPromoCode(NaN, 'SAVE10')).toThrow(RangeError);
  });
});



