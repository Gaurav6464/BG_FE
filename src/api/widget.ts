import axiosInstance from "./axiosInstance";

const widGetService = {
  get: async () => {
    try {
      const response = await axiosInstance.get(`/widget/get`);
      return response.data;
    } catch (error) {
      console.error("Error fetching widgets:", error);
      return {
        success: false,
        message: "Failed to fetch widgets.",
      };
    }
  },

  addOrUpdate: async (data: any) => {
    try {
      const response = await axiosInstance.post(`/widget/add-or-update`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating widgets:", error);
      return {
        success: false,
        message: "Failed to update widgets.",
      };
    }
  }
};

export default widGetService;
