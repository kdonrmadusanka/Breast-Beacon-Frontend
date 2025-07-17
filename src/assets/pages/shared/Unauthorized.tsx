// src/pages/shared/Unauthorized.tsx
import { Button } from "../../components/ui/Index";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">403 - Unauthorized</h1>
      <p className="text-lg">You don't have permission to access this page</p>
      <Button onClick={() => navigate("/")} text={"Return to Home"} />
    </div>
  );
};
