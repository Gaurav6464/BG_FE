import axiosInstance from "./axiosInstance";
import type { GetAllUsersParams, User } from "../types/user.type";


const UserService = {
  // ✅ Get All Users with query params (search, sort, filters, pagination)
 getAll: async (params: GetAllUsersParams) => {
    const queryString = new URLSearchParams({
      page: params.page?.toString() || "1",
      pageSize: params.limit?.toString() || "10",
      search: params.searchTerm || "",
      sort: params.sortField || "fullName",
      direction: params.sortDirection || "asc",
      role: params.role || "",
      isVerified:
        params.status === "Active"
          ? "true"
          : params.status === "Inactive"
          ? "false"
          : "",
    }).toString();

    const response = await axiosInstance.get(`/user/get?${queryString}`);
    return response.data; // { data, total }
  },
  // ✅ Get single user by ID
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/user/get/${id}`);
    return response.data; // expected User
  },

  // ✅ Add new user
  add: async (data: User) => {
    const response = await axiosInstance.post("/user/add", data);
    return response.data; // expected success response
  },

  // ✅ Update user
  update: async (id: string, data: Partial<User>) => {
    const response = await axiosInstance.put(`/user/update/${id}`, data);
    return response.data;
  },

  // ✅ Delete user
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/user/delete/${id}`);
    return response.data;
  },
  getAllUser:async () => {
    const response = await axiosInstance.get(`/user/getAllUser`);
    return response.data; // expected User
  }
};

export default UserService;
