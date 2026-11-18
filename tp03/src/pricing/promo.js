function applyPromoCode(price, code) {
  let discount = 0;
  if (code === 'SAVE10') discount = 0.1;
  if (code === 'SAVE20') discount = 0.2;

  return Math.round(price * (1 - discount) * 100) / 100;
}

module.exports = { applyPromoCode };
