import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      throw new Error("Network error: No response received from server");
    }
    if (error.response.status === 401) {
      useAuthStore.getState().logout();
      throw new Error("Unauthorized: Please log in again");
    }
    const message =
      error.response.data?.error ||
      error.response.data?.message ||
      error.message ||
      "Request failed";
    throw new Error(message);
  }
);

export const authService = {
  signup: async (email: string, password: string, role: string) => {
    try {
      const payload = { email, password, role };
      const response = await api.post("/api/auth/register", payload);
      console.log("Raw signup response:", response.data);

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error(
          "Invalid response structure: token or user data missing"
        );
      }

      useAuthStore.getState().setToken(token);
      return { token, user };
    } catch (error: any) {
      console.error("Signup API error:", error, {
        response: error.response,
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.message);
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error(
          "Invalid response structure: token or user data missing"
        );
      }

      useAuthStore.getState().setToken(token);
      return { token, user };
    } catch (error: any) {
      console.error("Login API error:", error);
      throw new Error(error.message);
    }
  },
  validateToken: async () => {
    try {
      const response = await api.get("/api/auth/validate");
      return response.data;
    } catch (error: any) {
      console.error("Validate token API error:", error);
      throw new Error(error.message);
    }
  },
};

export const dicomService = {
  uploadDICOM: async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append("dicomFile", file);
    try {
      const response = await api.post("/api/dicom/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  getDICOMImage: async (id: string) => {
    const response = await api.get(`/api/dicom/${id}/image`, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  },
  getDICOMMetadata: async (id: string) => {
    const response = await api.get(`/api/dicom/${id}/metadata`);
    return response.data;
  },
};

export const analysisService = {
  queueAnalysis: async (studyId: string) => {
    const response = await api.post("/api/analysis/queue", { studyId });
    return response.data;
  },
  getAnalysisResults: async (id: string) => {
    const response = await api.get(`/api/analysis/${id}/results`);
    return response.data;
  },
};

export const userService = {
  getRoleRequirements: async () => {
    const response = await api.get("/api/user/requirements");
    return response.data;
  },
  verifyAdminKey: async (adminKey: string) => {
    const response = await api.post("/api/user/verify-admin-key", { adminKey });
    return response.data;
  },
  completeProfile: async (profile: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
  }) => {
    const response = await api.post("/api/user/complete-profile", { profile });
    return response.data;
  },
  checkProfileCompletion: async () => {
    const response = await api.get("/api/user/check-completion");
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/api/user/me");
    return response.data;
  },
  updateProfile: async (profileData: {
    name?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
  }) => {
    const response = await api.patch("/api/user/profile", profileData);
    return response.data;
  },
};
