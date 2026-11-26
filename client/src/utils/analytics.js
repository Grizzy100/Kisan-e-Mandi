/**
 * Safe GA4 event helper. Uses window.gtag configured in index.html.
 * Never sends PII (email, phone, name, address).
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", eventName, params);
};

export const trackLogin = (method) => {
  trackEvent("login", { method });
};

export const trackSignUp = (method) => {
  trackEvent("sign_up", { method });
};

export const trackAddToCart = (product, quantity) => {
  if (!product) return;
  const qty = Number(quantity) || 1;
  const price = Number(product.price) || 0;

  trackEvent("add_to_cart", {
    currency: "INR",
    value: price * qty,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        price,
        quantity: qty,
      },
    ],
  });
};

export const trackPurchase = ({ transactionId, value, items }) => {
  const payload = {
    currency: "INR",
    value: Number(value) || 0,
    items: (items || []).map((item) => ({
      item_id: String(item.id),
      item_name: item.name,
      price: Number(item.price) || 0,
      quantity: Number(item.cartQuantity) || 1,
    })),
  };

  if (transactionId) {
    payload.transaction_id = String(transactionId);
  }

  trackEvent("purchase", payload);
};
