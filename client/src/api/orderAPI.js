import axiosInstance from "./axios";

export const placeOrder = async (data) => {
  const res = await axiosInstance.post("/orders", data);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await axiosInstance.get("/orders/my");
  return res.data;
};

export const getVendorOrders = async () => {
  const res = await axiosInstance.get("/orders/vendor");
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await axiosInstance.patch(`/orders/${id}/status`, { status });
  return res.data;
};

export const getOrderStats = async () => {
  const res = await axiosInstance.get("/orders/stats");
  return res.data;
};
