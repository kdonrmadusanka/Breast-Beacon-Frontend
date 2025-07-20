import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./assets/hooks/AuthContext";
import AppRoutes from "./AppRoutes"; // We'll create this component

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
