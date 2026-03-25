import api from "./api";

export async function login({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const response = await api.post("/auth/login", { email, password });
  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Login failed");
  }

  return response.data.data;
}
