// src/pages/public/Login.tsx
import { Button } from "../../components/ui/Index";
import { Input } from "../../components/ui/Index";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../../services/api"; // Use your existing service

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use your existing authService instead of fetch
      const data = await authService.login(formData.email, formData.password);

      // Store user data and token
      login(data.user, data.token);

      // Navigate based on user role or profile completion
      if (!data.user.profileCompleted) {
        navigate("/complete-profile");
      } else if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "moderator") {
        navigate("/moderator/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle different error types
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 404) {
        setError("User not found");
      } else if (
        err.code === "ECONNREFUSED" ||
        err.message.includes("Network Error")
      ) {
        setError(
          "Unable to connect to server. Please check if the server is running."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "An error occurred during login"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <Input
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="w-full"
            text={isLoading ? "Signing in..." : "Sign in"}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};
