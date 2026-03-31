export const getItemStatusCounts = async () => {
    const res = await axiosInstance.get("/items/status-counts");
    return res.data;
};
import axiosInstance from "./axios";

export const getItems = async (params) => {
    const res = await axiosInstance.get("/items", { params });
    return res.data;
};

export const getMyItems = async () => {
    const res = await axiosInstance.get("/items/me");
    return res.data;
};

export const publishItem = async (id) => {
    const res = await axiosInstance.patch(`/items/${id}/publish`);
    return res.data;
};

export const shelveItem = async (id) => {
    const res = await axiosInstance.patch(`/items/${id}/shelve`);
    return res.data;
};

export const deleteItem = async (id) => {
    const res = await axiosInstance.delete(`/items/${id}`);
    return res.data;
};
