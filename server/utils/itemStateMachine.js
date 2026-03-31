// Simple canTransitionItem export for compatibility
export function canTransitionItem(fromStatus, toStatus) {
  const allowed = ITEM_TRANSITIONS[fromStatus];
  return Boolean(allowed && allowed.has(toStatus));
}
export const ITEM_STATUS = Object.freeze({
  PENDING_ADMIN: "pending_admin",
  APPROVED_HIDDEN: "approved_hidden",
  PUBLISHED: "published",
  SHELVED: "shelved",
  SOLD_OUT: "sold_out",
  REJECTED: "rejected",
});

export const TICKET_STATUS = Object.freeze({
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
  REJECTED: "rejected",
});

// Transition table with explicit restock path and comments for edge cases
const ITEM_TRANSITIONS = Object.freeze({
  [ITEM_STATUS.PENDING_ADMIN]: new Set([
    ITEM_STATUS.APPROVED_HIDDEN,
    ITEM_STATUS.REJECTED,
  ]),
  [ITEM_STATUS.APPROVED_HIDDEN]: new Set([
    ITEM_STATUS.PUBLISHED, // Farmer accepts, goes live
    ITEM_STATUS.REJECTED,  // Admin/farmer rejects
    ITEM_STATUS.PENDING_ADMIN, // Admin reverts
    ITEM_STATUS.SHELVED,   // Farmer declines to go live
  ]),
  [ITEM_STATUS.PUBLISHED]: new Set([
    ITEM_STATUS.SHELVED,   // Farmer shelves listing
    ITEM_STATUS.SOLD_OUT,  // System auto-moves when quantity hits 0
  ]),
  [ITEM_STATUS.SHELVED]: new Set([
    ITEM_STATUS.PUBLISHED, // Farmer re-publishes
    ITEM_STATUS.REJECTED,  // Admin/farmer rejects
  ]),
  [ITEM_STATUS.SOLD_OUT]: new Set([
    ITEM_STATUS.PUBLISHED, // Restock: farmer/admin adds quantity and republishes
    ITEM_STATUS.SHELVED,   // Farmer shelves after restock
  ]),
  [ITEM_STATUS.REJECTED]: new Set([
    ITEM_STATUS.PENDING_ADMIN, // Admin/farmer appeals rejection
  ]),
});

const TICKET_TRANSITIONS = Object.freeze({
  [TICKET_STATUS.OPEN]: new Set([
    TICKET_STATUS.OPEN,
    TICKET_STATUS.IN_PROGRESS,
    TICKET_STATUS.RESOLVED,
    TICKET_STATUS.REJECTED,
  ]),
  [TICKET_STATUS.IN_PROGRESS]: new Set([
    TICKET_STATUS.IN_PROGRESS,
    TICKET_STATUS.RESOLVED,
    TICKET_STATUS.REJECTED,
  ]),
  [TICKET_STATUS.RESOLVED]: new Set([TICKET_STATUS.RESOLVED]),
  [TICKET_STATUS.REJECTED]: new Set([TICKET_STATUS.REJECTED]),
});

const TICKET_TO_ITEM_STATE = Object.freeze({
  [TICKET_STATUS.OPEN]: {
    status: ITEM_STATUS.PENDING_ADMIN,
    isActive: false,
  },
  [TICKET_STATUS.IN_PROGRESS]: {
    status: ITEM_STATUS.PENDING_ADMIN,
    isActive: false,
  },
  [TICKET_STATUS.RESOLVED]: {
    status: ITEM_STATUS.APPROVED_HIDDEN,
    isActive: false,
  },
  [TICKET_STATUS.REJECTED]: {
    status: ITEM_STATUS.REJECTED,
    isActive: false,
  },
});

export const MARKETPLACE_SOURCE_FILTER = Object.freeze({
  $or: [
    { ticketId: { $exists: true, $ne: null } },
    { postId: { $exists: true, $ne: null } },
  ],
});

export const isValidTicketStatus = (status) =>
  typeof status === "string" && Object.values(TICKET_STATUS).includes(status);

export const isValidItemStatus = (status) =>
  typeof status === "string" && Object.values(ITEM_STATUS).includes(status);

export const canTransitionTicket = (fromStatus, toStatus) => {
  const allowed = TICKET_TRANSITIONS[fromStatus];
  return Boolean(allowed && allowed.has(toStatus));
};


// Role-based guard utility for item transitions
// Only admins can approve/reject, only farmers can publish/shelve their own, buyers cannot transition
// Throws on invalid transitions if assert=true, else returns {allowed, reason}
export function checkItemTransition({
  currentStatus,
  nextStatus,
  actorRole,
  isOwner,
}) {
  // Input validation
  if (!currentStatus || !nextStatus || !actorRole) {
    return { allowed: false, reason: 'Missing required transition parameters' };
  }
  if (!Object.values(ITEM_STATUS).includes(currentStatus)) {
    return { allowed: false, reason: `Unknown current status: ${currentStatus}` };
  }
  if (!Object.values(ITEM_STATUS).includes(nextStatus)) {
    return { allowed: false, reason: `Unknown next status: ${nextStatus}` };
  }
  if (currentStatus === nextStatus) {
    return { allowed: true };
  }
  const allowed = ITEM_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.has(nextStatus)) {
    return {
      allowed: false,
      reason: `Transition ${currentStatus} → ${nextStatus} is not permitted`,
    };
  }
  // Role/ownership checks
  // Only admin can approve/reject
  if (
    (currentStatus === ITEM_STATUS.PENDING_ADMIN && nextStatus === ITEM_STATUS.APPROVED_HIDDEN) ||
    nextStatus === ITEM_STATUS.REJECTED
  ) {
    if (actorRole !== 'admin') {
      return { allowed: false, reason: 'Only admin can approve or reject items' };
    }
  }
  // Only owner (farmer) can publish/shelve their own item
  if (
    [ITEM_STATUS.APPROVED_HIDDEN, ITEM_STATUS.SHELVED].includes(currentStatus) &&
    [ITEM_STATUS.PUBLISHED, ITEM_STATUS.SHELVED].includes(nextStatus)
  ) {
    if (actorRole !== 'farmer' || !isOwner) {
      return { allowed: false, reason: 'Only the owning farmer can publish or shelve their item' };
    }
  }
  // Only system can move published → sold_out
  if (
    currentStatus === ITEM_STATUS.PUBLISHED &&
    nextStatus === ITEM_STATUS.SOLD_OUT
  ) {
    if (actorRole !== 'system') {
      return { allowed: false, reason: 'Only the system can mark an item as sold out' };
    }
  }
  // Only admin/farmer can restock (sold_out → published)
  if (
    currentStatus === ITEM_STATUS.SOLD_OUT &&
    nextStatus === ITEM_STATUS.PUBLISHED
  ) {
    if (!['admin', 'farmer'].includes(actorRole) || (actorRole === 'farmer' && !isOwner)) {
      return { allowed: false, reason: 'Only admin or owning farmer can restock and republish' };
    }
  }
  // Buyers cannot transition any item
  if (actorRole === 'buyer') {
    return { allowed: false, reason: 'Buyers cannot change item status' };
  }
  return { allowed: true };
}

export function assertItemTransition(params) {
  const result = checkItemTransition(params);
  if (!result.allowed) {
    const err = new Error(result.reason);
    err.statusCode = 403;
    throw err;
  }
}

export const getItemStateForTicketStatus = (ticketStatus) => {
  if (!isValidTicketStatus(ticketStatus)) {
    throw new Error("Invalid ticket status provided for item state mapping.");
  }
  return { ...TICKET_TO_ITEM_STATE[ticketStatus] };
};

export const canPublishFromStatus = (status) =>
  status === ITEM_STATUS.APPROVED_HIDDEN || status === ITEM_STATUS.SHELVED || status === ITEM_STATUS.SOLD_OUT;

export const canShelveFromStatus = (status) =>
  status === ITEM_STATUS.PUBLISHED || status === ITEM_STATUS.SOLD_OUT;
