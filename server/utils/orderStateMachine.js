export const ORDER_STATUS = Object.freeze({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
});

const ORDER_TRANSITIONS = Object.freeze({
  [ORDER_STATUS.PENDING]: new Set([ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED]),
  [ORDER_STATUS.CONFIRMED]: new Set([ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED]),
  [ORDER_STATUS.SHIPPED]: new Set([ORDER_STATUS.DELIVERED]),
  [ORDER_STATUS.DELIVERED]: new Set([]),
  [ORDER_STATUS.CANCELLED]: new Set([]),
});

export const ORDER_STATUSES = Object.values(ORDER_STATUS);

export const isValidOrderStatus = (status) =>
  typeof status === "string" && ORDER_STATUSES.includes(status);


// Guard utility for order transitions and permissions
// Throws on invalid transitions, returns {allowed, reason} if not assert
export function checkOrderTransition({
  currentStatus,
  nextStatus,
  actorRole,
  isBuyer,
  isSeller,
  isAdmin,
  assert = false,
}) {
  // Input validation
  if (!currentStatus || !nextStatus || !actorRole) {
    const reason = 'Missing required transition parameters';
    if (assert) throw Object.assign(new Error(reason), { statusCode: 400 });
    return { allowed: false, reason };
  }
  if (!Object.values(ORDER_STATUS).includes(currentStatus)) {
    const reason = `Unknown current status: ${currentStatus}`;
    if (assert) throw Object.assign(new Error(reason), { statusCode: 400 });
    return { allowed: false, reason };
  }
  if (!Object.values(ORDER_STATUS).includes(nextStatus)) {
    const reason = `Unknown next status: ${nextStatus}`;
    if (assert) throw Object.assign(new Error(reason), { statusCode: 400 });
    return { allowed: false, reason };
  }
  if (currentStatus === nextStatus) {
    return { allowed: true };
  }
  const allowed = ORDER_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.has(nextStatus)) {
    const reason = `Transition ${currentStatus} → ${nextStatus} is not permitted`;
    if (assert) throw Object.assign(new Error(reason), { statusCode: 409 });
    return { allowed: false, reason };
  }
  // Terminal states: no further transitions
  if ([ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(currentStatus)) {
    const reason = `Order is in terminal state: ${currentStatus}`;
    if (assert) throw Object.assign(new Error(reason), { statusCode: 409 });
    return { allowed: false, reason };
  }
  // Prevent double-cancellation
  if (nextStatus === ORDER_STATUS.CANCELLED && currentStatus === ORDER_STATUS.CANCELLED) {
    const reason = 'Order is already cancelled';
    if (assert) throw Object.assign(new Error(reason), { statusCode: 409 });
    return { allowed: false, reason };
  }
  // Role/actor checks
  if (isAdmin) return { allowed: true };
  if (isBuyer) {
    // Buyer can only cancel before shipping
    if (
      nextStatus === ORDER_STATUS.CANCELLED &&
      [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(currentStatus)
    ) {
      return { allowed: true };
    }
    const reason = 'Buyers can only cancel before shipping';
    if (assert) throw Object.assign(new Error(reason), { statusCode: 403 });
    return { allowed: false, reason };
  }
  if (isSeller) {
    // Seller can confirm, ship, deliver, or cancel (if not terminal)
    if ([ORDER_STATUS.CONFIRMED, ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(nextStatus)) {
      return { allowed: true };
    }
    const reason = 'Sellers can only confirm, ship, deliver, or cancel';
    if (assert) throw Object.assign(new Error(reason), { statusCode: 403 });
    return { allowed: false, reason };
  }
  const reason = 'Not authorized to update order';
  if (assert) throw Object.assign(new Error(reason), { statusCode: 403 });
  return { allowed: false, reason };
}

export function assertOrderTransition(params) {
  return checkOrderTransition({ ...params, assert: true });
}

export const canActorUpdateOrder = ({
  isAdmin,
  isSeller,
  isBuyer,
  currentStatus,
  nextStatus,
}) => {
  if (isAdmin) return true;

  if (isBuyer) {
    // Customers can only cancel, and only before shipping.
    return (
      nextStatus === ORDER_STATUS.CANCELLED &&
      [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(currentStatus)
    );
  }

  if (isSeller) {
    return [
      ORDER_STATUS.CONFIRMED,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.CANCELLED,
    ].includes(nextStatus);
  }

  return false;
};
