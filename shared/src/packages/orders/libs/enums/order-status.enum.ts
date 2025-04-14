const OrderStatus = {
  CREATED: "created",
  PROCESSING: "processing",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export { OrderStatus };
