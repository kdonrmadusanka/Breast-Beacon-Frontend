// src/pages/dev/TestLogin.tsx
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Index";

// Define the mock patient with proper typing
const mockPatient = {
  id: "pat-12345",
  name: "Sarah Johnson",
  role: "patient" as const, // <-- This ensures it's typed as 'patient' literal
  email: "sarah@example.com",
  avatar: "/avatars/patient-female.png",
};

export const TestLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handlePatientLogin = () => {
    login(mockPatient, "mock-token-123");
    navigate("/patient/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-2xl font-bold">Development Login</h1>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Button
          onClick={handlePatientLogin}
          className="w-full"
          text={"Login as Patient"}
        />
        <Button
          variant="filled"
          onClick={() => navigate("/")}
          className="w-full"
          text={"Back to Home"}
        />
      </div>
    </div>
  );
};
