function applyPromoCode(price, code) {
  if (code === 'SAVE10') {
    return price * 0.9;
  }
  return price;
}

module.exports = { applyPromoCode };
