import { Button } from "../../components/ui/Index";
import { Input } from "../../components/ui/Index";
import { SelectWithLabel } from "../../components/ui/SelectWithLabel";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../../services/api";

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState<SignupForm>({
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "role") {
      const validRoles = ["patient", "clinician", "admin"];
      if (!validRoles.includes(value)) {
        setError("Invalid role selected");
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 8) {
      setError(
        "Password must be at least 8 characters with a letter and a number"
      );
      return false;
    }
    if (!formData.password.match(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)) {
      setError("Password must contain at least one letter and one number");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!["patient", "clinician", "admin"].includes(formData.role)) {
      setError("Invalid role selected");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      console.log("Sending signup payload:", payload);
      const response = await authService.signup(
        formData.email,
        formData.password,
        formData.role
      );

      console.log("Signup response:", response);

      const { token, user } = response;

      if (!token || !user) {
        throw new Error(
          "Invalid response structure: token or user data missing"
        );
      }

      login(token, user);
      localStorage.setItem("token", token);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "clinician") {
        navigate("/clinician/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (err: any) {
      console.error("Signup error:", err, {
        response: err.response,
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 409) {
        setError("Email is already registered");
      } else if (err.message.includes("Network Error")) {
        setError("Unable to connect to server. Please check your connection.");
      } else {
        setError(
          err.message || "An error occurred during signup. Please try again."
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
          Create your account
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

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
          />

          <SelectWithLabel
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={[
              { value: "patient", label: "Patient" },
              { value: "clinician", label: "Clinician" },
              { value: "admin", label: "Admin" },
            ]}
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="w-full"
            text={isLoading ? "Creating account..." : "Sign up"}
            disabled={isLoading}
          />
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
