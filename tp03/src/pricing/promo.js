function applyPromoCode(price, code) {
  if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    throw new RangeError('Le prix doit être un nombre positif.');
  }

  let discount = 0;

  if (code === 'SAVE10') {
    discount = 0.10;
  } else if (code === 'SAVE20') {
    discount = 0.20;
  }

  const finalPrice = price * (1 - discount);
  return Math.round(finalPrice * 100) / 100;
}

module.exports = { applyPromoCode };
