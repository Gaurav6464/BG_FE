import axiosInstance from "./axiosInstance";
import type {
  ExternalResource,
  GetAllExternalResourcesParams,
} from "../types/externalResource.type";

const externalResourceService = {
  getAll: async (params: GetAllExternalResourcesParams) => {
    try {
      const queryString = new URLSearchParams({
        page: params.page?.toString() || "1",
        pageSize: params.limit?.toString() || "10",
        search: params.searchTerm || "",
        sort: params.sortField || "createdAt",
        direction: params.sortDirection || "desc",
        type: params.type || "",
      }).toString();
      const response = await axiosInstance.get(`/resource?${queryString}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/resource/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Add new resource
  add: async (data: ExternalResource) => {
    try {
      const response = await axiosInstance.post("/resource", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Update resource
  update: async (id: string, data: Partial<ExternalResource>) => {
    try {
      const response = await axiosInstance.put(`/resource/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Delete resource
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/resource/${id}`);
    return response.data;
  },
};

export default externalResourceService;
