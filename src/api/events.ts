// services/event.service.ts
import axiosInstance from "./axiosInstance";
import type { Event, GetAllEventsParams } from "../types/event.type";

const eventService = {
  getAll: async (params: GetAllEventsParams) => {
    try {
      const queryString = new URLSearchParams({
        page: params.page?.toString() ?? "1",
        pageSize: params.limit?.toString() ?? "10",
        search: params.searchTerm ?? "",
        sort: params.sortField ?? "name",
        direction: params.sortDirection ?? "asc",
        city: params.city ?? "",
        type: params.type ?? "",
        isOnline:
          typeof params.isOnline === "boolean"
            ? params.isOnline.toString()
            : "",
        status: params.status ?? "upcoming",
      }).toString();

      const { data } = await axiosInstance.get(`/events/getAll?${queryString}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const { data } = await axiosInstance.get(`/events/get/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  add: async (payload: Event) => {
    try {
      const { data } = await axiosInstance.post("/events/add", payload);
      return data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id: string, payload: Partial<Event>) => {
    try {
      const { data } = await axiosInstance.put(`/events/update/${id}`, payload);
      return data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const { data } = await axiosInstance.delete(`/events/delete/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  getAllFilters: async (status:any) => {
    try {
      const { data } = await axiosInstance.get( `/events/getAllFilters?status=${status}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
  getAllEvents:async () => {
    try {
      const { data } = await axiosInstance.get( `/events/getAllEvents`);
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default eventService;
